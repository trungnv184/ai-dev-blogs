import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  Req,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { Response, Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CVService } from './cv.service';
import { UpdateCVDto, UpdateManagementSkillsDto, UpdateProfileDto } from './dto';

@Controller('cv')
export class CVController {
  constructor(private readonly cvService: CVService) {}

  // Admin endpoints (JWT protected)

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async uploadCV(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException({
        code: 'NO_FILE',
        message: 'No file uploaded. Please select a PDF file.',
      });
    }
    return this.cvService.uploadAndParse(file);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCV() {
    const cvData = await this.cvService.getCVData();
    const managementSkills = await this.cvService.getManagementSkills();

    return cvData
      ? {
          ...cvData,
          managementSkills,
        }
      : null;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateCV(@Body() dto: UpdateCVDto) {
    const cvData = await this.cvService.updateCVData(dto);
    return cvData;
  }

  @Post('publish')
  @UseGuards(JwtAuthGuard)
  async publish() {
    await this.cvService.publish();
    return { message: 'CV published successfully.' };
  }

  @Post('unpublish')
  @UseGuards(JwtAuthGuard)
  async unpublish() {
    await this.cvService.unpublish();
    return { message: 'CV unpublished successfully.' };
  }

  @Get('management-skills')
  @UseGuards(JwtAuthGuard)
  async getManagementSkills() {
    const skills = await this.cvService.getManagementSkills();
    return skills;
  }

  @Put('management-skills')
  @UseGuards(JwtAuthGuard)
  async updateManagementSkills(@Body() dto: UpdateManagementSkillsDto) {
    const skills = await this.cvService.updateManagementSkills(dto);
    return skills;
  }

  // Public endpoints (no auth)

  @Get('public')
  async getPublicCV() {
    const data = await this.cvService.getPublicCV();
    return data;
  }

  @Get('download')
  async downloadCV(@Req() req: Request, @Res() res: Response): Promise<void> {
    const result = await this.cvService.getDownloadStream();

    if (!result) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'CV not available for download.',
      });
      return;
    }

    // Log download
    const userAgent = req.headers['user-agent'];
    const ipAddress =
      req.ip ?? req.headers['x-forwarded-for']?.toString().split(',')[0];
    await this.cvService.logDownload(userAgent, ipAddress);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.filename}"`,
    );

    result.stream.pipe(res);
  }

  // Profile endpoints

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile() {
    const profile = await this.cvService.getProfile();
    return profile;
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() dto: UpdateProfileDto) {
    const profile = await this.cvService.updateProfile(dto);
    return profile;
  }

  @Post('profile/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException({
        code: 'NO_FILE',
        message: 'No image uploaded. Please select an image file.',
      });
    }
    const imageUrl = await this.cvService.uploadProfileImage(file);
    return { imageUrl };
  }

  @Get('profile/public')
  async getPublicProfile() {
    const profile = await this.cvService.getPublicProfile();
    return profile;
  }

  @Get('profile/image/:identifier')
  async getProfileImage(
    @Param('identifier') identifier: string,
    @Res() res: Response,
  ): Promise<void> {
    const image = await this.cvService.getProfileImage(identifier);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    res.setHeader('Content-Type', image.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(image.data);
  }
}
