import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { CVController } from './cv.controller';
import { CVService, CVParseResult, PublicCVData } from './cv.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';

describe('CVController', () => {
  let app: INestApplication;
  let cvService: jest.Mocked<CVService>;

  const mockCVData = {
    id: 'cv-123',
    skills: ['JavaScript', 'TypeScript'],
    workHistory: [
      {
        id: 'wh-1',
        company: 'Tech Corp',
        role: 'Engineer',
        startDate: '2020-01',
        current: true,
        highlights: [],
        badges: ['JavaScript', 'React', 'Team Leadership'],
      },
    ],
    education: [],
    published: false,
    pdfFilePath: 'test.pdf',
    pdfFileName: 'original.pdf',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockManagementSkills = [
    { id: 'skill-1', name: 'Leadership', percentage: 30, sortOrder: 0 },
  ];

  beforeEach(async () => {
    const mockCVService = {
      uploadAndParse: jest.fn(),
      getCVData: jest.fn(),
      updateCVData: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      getManagementSkills: jest.fn(),
      updateManagementSkills: jest.fn(),
      getPublicCV: jest.fn(),
      getDownloadData: jest.fn(),
      logDownload: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CVController],
      providers: [
        {
          provide: CVService,
          useValue: mockCVService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();

    cvService = module.get(CVService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /cv/upload', () => {
    it('should upload and parse a PDF file', async () => {
      const parseResult: CVParseResult = {
        success: true,
        message: 'CV uploaded and parsed successfully.',
        data: {
          skills: ['JavaScript'],
          workHistory: [],
          education: [],
        },
      };

      cvService.uploadAndParse.mockResolvedValue(parseResult);

      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('file', Buffer.from('%PDF-1.4 test content'), 'test.pdf')
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.success).toBe(true);
      expect(cvService.uploadAndParse).toHaveBeenCalled();
    });

    it('should return parsed work history with badges', async () => {
      const parseResult: CVParseResult = {
        success: true,
        message: 'CV uploaded and parsed successfully.',
        data: {
          skills: ['JavaScript', 'TypeScript'],
          workHistory: [
            {
              id: 'wh-1',
              company: 'Tech Corp',
              role: 'Senior Engineer',
              startDate: 'January 2020',
              current: true,
              highlights: [],
              badges: ['JavaScript', 'React', 'Team Leadership', 'Mentoring'],
            },
          ],
          education: [],
        },
      };

      cvService.uploadAndParse.mockResolvedValue(parseResult);

      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('file', Buffer.from('%PDF-1.4 test content'), 'test.pdf')
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data.workHistory).toBeDefined();
      expect(response.body.data.data.workHistory[0].badges).toBeDefined();
      expect(response.body.data.data.workHistory[0].badges).toContain('JavaScript');
      expect(response.body.data.data.workHistory[0].badges).toContain('Team Leadership');
    });
  });

  describe('GET /cv', () => {
    it('should return CV data with management skills', async () => {
      cvService.getCVData.mockResolvedValue(mockCVData as never);
      cvService.getManagementSkills.mockResolvedValue(mockManagementSkills as never);

      const response = await request(app.getHttpServer())
        .get('/cv')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.skills).toEqual(mockCVData.skills);
      expect(response.body.data.managementSkills).toEqual(mockManagementSkills);
    });

    it('should return null data when no CV exists', async () => {
      cvService.getCVData.mockResolvedValue(null);
      cvService.getManagementSkills.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/cv')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeNull();
    });
  });

  describe('PUT /cv', () => {
    it('should update CV data', async () => {
      const updateDto = {
        skills: ['React', 'Node.js'],
        workHistory: [
          {
            company: 'New Corp',
            role: 'Developer',
            startDate: '2021-01',
            current: true,
            highlights: [],
          },
        ],
        education: [],
      };

      cvService.updateCVData.mockResolvedValue({
        ...mockCVData,
        skills: updateDto.skills,
      } as never);

      const response = await request(app.getHttpServer())
        .put('/cv')
        .send(updateDto)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(cvService.updateCVData).toHaveBeenCalledWith(updateDto);
    });
  });

  describe('POST /cv/publish', () => {
    it('should publish the CV', async () => {
      cvService.publish.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .post('/cv/publish')
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('CV published successfully.');
      expect(cvService.publish).toHaveBeenCalled();
    });
  });

  describe('POST /cv/unpublish', () => {
    it('should unpublish the CV', async () => {
      cvService.unpublish.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .post('/cv/unpublish')
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('CV unpublished successfully.');
      expect(cvService.unpublish).toHaveBeenCalled();
    });
  });

  describe('GET /cv/management-skills', () => {
    it('should return management skills', async () => {
      cvService.getManagementSkills.mockResolvedValue(mockManagementSkills as never);

      const response = await request(app.getHttpServer())
        .get('/cv/management-skills')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockManagementSkills);
    });
  });

  describe('PUT /cv/management-skills', () => {
    it('should update management skills', async () => {
      const updateDto = {
        skills: [{ name: 'New Skill', percentage: 50 }],
      };

      cvService.updateManagementSkills.mockResolvedValue([
        { id: 'new-skill-1', name: 'New Skill', percentage: 50, sortOrder: 0 },
      ] as never);

      const response = await request(app.getHttpServer())
        .put('/cv/management-skills')
        .send(updateDto)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(cvService.updateManagementSkills).toHaveBeenCalledWith(updateDto);
    });
  });

  describe('GET /cv/public', () => {
    it('should return public CV data when published', async () => {
      const publicData: PublicCVData = {
        skills: mockCVData.skills,
        workHistory: mockCVData.workHistory,
        education: [],
        managementSkills: mockManagementSkills,
        downloadUrl: '/api/cv/download',
      };

      cvService.getPublicCV.mockResolvedValue(publicData);

      const response = await request(app.getHttpServer())
        .get('/cv/public')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(publicData);
    });

    it('should return work history with badges in public data', async () => {
      const publicData: PublicCVData = {
        skills: ['JavaScript', 'TypeScript'],
        workHistory: [
          {
            id: 'wh-1',
            company: 'Tech Corp',
            role: 'Engineer',
            startDate: '2020-01',
            current: true,
            highlights: [],
            badges: ['JavaScript', 'React', 'Team Leadership'],
          },
        ],
        education: [],
        managementSkills: mockManagementSkills,
        downloadUrl: '/api/cv/download',
      };

      cvService.getPublicCV.mockResolvedValue(publicData);

      const response = await request(app.getHttpServer())
        .get('/cv/public')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.workHistory[0].badges).toBeDefined();
      expect(response.body.data.workHistory[0].badges).toContain('JavaScript');
      expect(response.body.data.workHistory[0].badges).toContain('React');
      expect(response.body.data.workHistory[0].badges).toContain('Team Leadership');
    });

    it('should return null when no published CV exists', async () => {
      cvService.getPublicCV.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/cv/public')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeNull();
    });
  });

  describe('GET /cv/download', () => {
    it('should send PDF buffer for download', async () => {
      cvService.getDownloadData.mockResolvedValue({
        buffer: Buffer.from('%PDF-1.4 content'),
        filename: 'Test_Developer_CV.pdf',
      });
      cvService.logDownload.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .get('/cv/download')
        .expect(200);

      expect(response.headers['content-type']).toBe('application/pdf');
      expect(response.headers['content-disposition']).toContain('Test_Developer_CV.pdf');
      expect(cvService.logDownload).toHaveBeenCalled();
    });

    it('should return 404 when CV is not available for download', async () => {
      cvService.getDownloadData.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/cv/download')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('CV not available for download.');
    });
  });
});
