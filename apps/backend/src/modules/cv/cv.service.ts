import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import {
  CVDataEntity,
  ManagementSkillEntity,
  CVDownloadLogEntity,
  ProfileDataEntity,
  WorkHistoryEntryData,
  EducationEntryData,
  ContactInfoData,
} from './entities';
import { UpdateCVDto, UpdateManagementSkillsDto, UpdateProfileDto } from './dto';
import { PDFParserService, CVErrorCode, ParsedCVData } from './services/pdf-parser.service';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const PDF_MAGIC_BYTES = '%PDF';

export interface CVParseResult {
  success: boolean;
  message: string;
  data?: ParsedCVData;
  warnings?: string[];
}

export interface PublicCVData {
  skills: string[];
  workHistory: WorkHistoryEntryData[];
  education: EducationEntryData[];
  managementSkills: Array<{
    id: string;
    name: string;
    percentage: number;
  }>;
  downloadUrl?: string;
}

export interface PublicProfileData {
  name: string;
  title: string;
  summary: string;
  location?: string;
  locationUrl?: string;
  profileImageUrl?: string;
  contacts: ContactInfoData;
}

@Injectable()
export class CVService {
  private uploadInProgress = false;
  private readonly uploadsDir: string;
  private readonly profileImagesDir: string;

  constructor(
    @InjectRepository(CVDataEntity)
    private readonly cvDataRepository: Repository<CVDataEntity>,
    @InjectRepository(ManagementSkillEntity)
    private readonly managementSkillRepository: Repository<ManagementSkillEntity>,
    @InjectRepository(CVDownloadLogEntity)
    private readonly downloadLogRepository: Repository<CVDownloadLogEntity>,
    @InjectRepository(ProfileDataEntity)
    private readonly profileDataRepository: Repository<ProfileDataEntity>,
    private readonly pdfParserService: PDFParserService,
    private readonly configService: ConfigService,
  ) {
    this.uploadsDir = path.join(process.cwd(), 'uploads', 'cv');
    this.profileImagesDir = path.join(process.cwd(), 'uploads', 'profile');
    this.ensureUploadsDirExists();
  }

  private ensureUploadsDirExists(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
    if (!fs.existsSync(this.profileImagesDir)) {
      fs.mkdirSync(this.profileImagesDir, { recursive: true });
    }
  }

  async uploadAndParse(file: Express.Multer.File): Promise<CVParseResult> {
    if (this.uploadInProgress) {
      throw new BadRequestException({
        code: CVErrorCode.UPLOAD_IN_PROGRESS,
        message: 'Please wait for the current upload to complete.',
      });
    }

    this.uploadInProgress = true;
    const warnings: string[] = [];

    try {
      // Validate file type
      if (!file.mimetype.includes('pdf')) {
        throw new BadRequestException({
          code: CVErrorCode.INVALID_FILE_TYPE,
          message: 'Invalid file type. Please upload a PDF file.',
        });
      }

      // Validate magic bytes
      const buffer = file.buffer;
      const header = buffer.slice(0, 4).toString('ascii');
      if (!header.startsWith(PDF_MAGIC_BYTES)) {
        throw new BadRequestException({
          code: CVErrorCode.INVALID_FILE_TYPE,
          message: 'Invalid file type. Please upload a PDF file.',
        });
      }

      // Validate file size
      if (buffer.length > MAX_FILE_SIZE) {
        throw new BadRequestException({
          code: CVErrorCode.FILE_TOO_LARGE,
          message: 'File too large. Maximum size is 10MB.',
        });
      }

      // Store PDF data in database
      const fileUuid = uuidv4();
      const fileName = `${fileUuid}.pdf`;

      // Parse PDF
      const parsedData = await this.pdfParserService.parse(buffer);

      // Check for partial data
      const sectionsFound = [
        parsedData.skills.length > 0,
        parsedData.workHistory.length > 0,
        parsedData.education.length > 0,
      ].filter(Boolean).length;

      if (sectionsFound < 2) {
        warnings.push(
          'Partial data extracted. Please review and complete missing information manually.',
        );
      }

      // Upsert CV data
      const existingCV = await this.cvDataRepository.findOne({ where: {} });
      const cvData = existingCV ?? new CVDataEntity();

      // Log work history before and after parsing
      console.log('=== CV Upload: Work History Debug ===');
      console.log('Existing work history count:', existingCV?.workHistory?.length ?? 0);
      console.log('Existing work history:', JSON.stringify(existingCV?.workHistory ?? [], null, 2));
      console.log('Parsed work history count:', parsedData.workHistory.length);
      console.log('Parsed work history:', JSON.stringify(parsedData.workHistory, null, 2));

      cvData.skills = parsedData.skills;
      cvData.workHistory = parsedData.workHistory as WorkHistoryEntryData[];
      cvData.education = parsedData.education as EducationEntryData[];
      cvData.pdfFileName = file.originalname;
      cvData.pdfFilePath = fileName;
      cvData.pdfData = buffer.toString('base64');

      console.log('Final work history to save:', JSON.stringify(cvData.workHistory, null, 2));
      console.log('=== End Work History Debug ===');

      await this.cvDataRepository.save(cvData);

      return {
        success: true,
        message: 'CV uploaded and parsed successfully.',
        data: parsedData,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } finally {
      this.uploadInProgress = false;
    }
  }

  async getCVData(): Promise<CVDataEntity | null> {
    return this.cvDataRepository.findOne({ where: {} });
  }

  async updateCVData(dto: UpdateCVDto): Promise<CVDataEntity> {
    let cvData = await this.cvDataRepository.findOne({ where: {} });

    if (!cvData) {
      cvData = new CVDataEntity();
    }

    cvData.skills = dto.skills;
    cvData.workHistory = dto.workHistory.map((wh) => ({
      id: wh.id ?? uuidv4(),
      company: wh.company,
      role: wh.role,
      startDate: wh.startDate,
      endDate: wh.endDate,
      current: wh.current,
      description: wh.description,
      highlights: wh.highlights,
      location: wh.location,
      badges: wh.badges,
    }));
    cvData.education = (dto.education ?? []).map((edu) => ({
      id: edu.id ?? uuidv4(),
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      current: edu.current,
    }));

    return this.cvDataRepository.save(cvData);
  }

  async publish(): Promise<void> {
    const cvData = await this.cvDataRepository.findOne({ where: {} });

    if (!cvData) {
      throw new NotFoundException({
        code: CVErrorCode.CV_NOT_FOUND,
        message: 'No CV data found. Please upload a CV first.',
      });
    }

    cvData.published = true;
    cvData.publishedAt = new Date();
    await this.cvDataRepository.save(cvData);
  }

  async unpublish(): Promise<void> {
    const cvData = await this.cvDataRepository.findOne({ where: {} });

    if (!cvData) {
      throw new NotFoundException({
        code: CVErrorCode.CV_NOT_FOUND,
        message: 'No CV data found.',
      });
    }

    cvData.published = false;
    cvData.publishedAt = undefined;
    await this.cvDataRepository.save(cvData);
  }

  async getPublicCV(): Promise<PublicCVData | null> {
    const cvData = await this.cvDataRepository.findOne({
      where: { published: true },
    });

    if (!cvData) {
      return null;
    }

    const managementSkills = await this.managementSkillRepository.find({
      order: { sortOrder: 'ASC' },
    });

    return {
      skills: cvData.skills,
      workHistory: cvData.workHistory,
      education: cvData.education,
      managementSkills: managementSkills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        percentage: skill.percentage,
      })),
      downloadUrl: cvData.pdfFilePath ? '/api/cv/download' : undefined,
    };
  }

  async getManagementSkills(): Promise<ManagementSkillEntity[]> {
    return this.managementSkillRepository.find({
      order: { sortOrder: 'ASC' },
    });
  }

  async updateManagementSkills(
    dto: UpdateManagementSkillsDto,
  ): Promise<ManagementSkillEntity[]> {
    // Delete existing skills not in the update
    const existingSkills = await this.managementSkillRepository.find();
    const updateIds = dto.skills.filter((s) => s.id).map((s) => s.id);

    for (const existing of existingSkills) {
      if (!updateIds.includes(existing.id)) {
        await this.managementSkillRepository.remove(existing);
      }
    }

    // Upsert skills
    const savedSkills: ManagementSkillEntity[] = [];
    for (let i = 0; i < dto.skills.length; i++) {
      const skillDto = dto.skills[i];
      if (!skillDto) continue;

      let skill: ManagementSkillEntity;

      if (skillDto.id) {
        const existing = await this.managementSkillRepository.findOne({
          where: { id: skillDto.id },
        });
        skill = existing ?? new ManagementSkillEntity();
      } else {
        skill = new ManagementSkillEntity();
      }

      skill.name = skillDto.name;
      skill.percentage = skillDto.percentage;
      skill.sortOrder = i;

      savedSkills.push(await this.managementSkillRepository.save(skill));
    }

    return savedSkills;
  }

  async getDownloadData(): Promise<{
    buffer: Buffer;
    filename: string;
  } | null> {
    const cvData = await this.cvDataRepository.findOne({
      where: { published: true },
    });

    if (!cvData?.pdfData) {
      return null;
    }

    const ownerName =
      this.configService.get<string>('SITE_OWNER_NAME') ?? 'Developer';
    const filename = `${ownerName.replace(/\s+/g, '_')}_CV.pdf`;

    return {
      buffer: Buffer.from(cvData.pdfData, 'base64'),
      filename,
    };
  }

  async logDownload(userAgent?: string, ipAddress?: string): Promise<void> {
    const log = new CVDownloadLogEntity();
    log.userAgent = userAgent?.slice(0, 500) ?? null;
    log.ipAddress = ipAddress?.slice(0, 45) ?? null;
    await this.downloadLogRepository.save(log);
  }

  // Profile methods
  async getProfile(): Promise<ProfileDataEntity | null> {
    return this.profileDataRepository.findOne({ where: {} });
  }

  async getPublicProfile(): Promise<PublicProfileData | null> {
    const profile = await this.profileDataRepository.findOne({ where: {} });

    if (!profile) {
      return null;
    }

    return {
      name: profile.name,
      title: profile.title,
      summary: profile.summary,
      location: profile.location,
      locationUrl: profile.locationUrl,
      profileImageUrl: profile.profileImageData
        ? `/api/cv/profile/image/${profile.id}`
        : undefined,
      contacts: profile.contacts,
    };
  }

  async updateProfile(dto: UpdateProfileDto): Promise<ProfileDataEntity> {
    let profile = await this.profileDataRepository.findOne({ where: {} });

    if (!profile) {
      profile = new ProfileDataEntity();
    }

    profile.name = dto.name;
    profile.title = dto.title;
    profile.summary = dto.summary;
    profile.location = dto.location;
    profile.locationUrl = dto.locationUrl;
    profile.contacts = dto.contacts;

    return this.profileDataRepository.save(profile);
  }

  async uploadProfileImage(file: Express.Multer.File): Promise<string> {
    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException({
        code: 'INVALID_IMAGE_TYPE',
        message: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
      });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.buffer.length > maxSize) {
      throw new BadRequestException({
        code: 'IMAGE_TOO_LARGE',
        message: 'Image too large. Maximum size is 5MB.',
      });
    }

    let profile = await this.profileDataRepository.findOne({ where: {} });

    if (!profile) {
      profile = new ProfileDataEntity();
      profile.name = 'Your Name';
      profile.title = 'Your Title';
      profile.summary = 'Your professional summary';
      profile.contacts = {};
    }

    // Store image as base64 in database
    profile.profileImageData = file.buffer.toString('base64');
    profile.profileImageMimeType = file.mimetype;
    profile.profileImagePath = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
    await this.profileDataRepository.save(profile);

    return `/api/cv/profile/image/${profile.id}`;
  }

  async getProfileImage(identifier: string): Promise<{ data: Buffer; mimeType: string } | null> {
    // Try to find by ID first (new format), then by filename (legacy)
    let profile = await this.profileDataRepository.findOne({ where: { id: identifier } });
    if (!profile) {
      profile = await this.profileDataRepository.findOne({
        where: { profileImagePath: identifier },
      });
    }

    if (!profile?.profileImageData) {
      return null;
    }

    return {
      data: Buffer.from(profile.profileImageData, 'base64'),
      mimeType: profile.profileImageMimeType || 'image/jpeg',
    };
  }
}
