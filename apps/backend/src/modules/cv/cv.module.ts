import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { CVController } from './cv.controller';
import { CVService } from './cv.service';
import { PDFParserService } from './services/pdf-parser.service';
import {
  CVDataEntity,
  ManagementSkillEntity,
  CVDownloadLogEntity,
  ProfileDataEntity,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CVDataEntity,
      ManagementSkillEntity,
      CVDownloadLogEntity,
      ProfileDataEntity,
    ]),
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  ],
  controllers: [CVController],
  providers: [CVService, PDFParserService],
  exports: [CVService],
})
export class CVModule {}
