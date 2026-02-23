import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private cvUrl: string | null = null;

  constructor(private configService: ConfigService) {}

  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File too large. Maximum size is 5MB');
    }

    // TODO: Implement actual cloud storage upload (Cloudinary/S3)
    // For now, return a placeholder URL
    const filename = `${Date.now()}-${file.originalname}`;
    this.logger.log(`Image upload: ${filename}`);

    return {
      url: `/uploads/images/${filename}`,
    };
  }

  async uploadCV(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Invalid file type. Only PDF files are allowed');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File too large. Maximum size is 10MB');
    }

    // TODO: Implement actual cloud storage upload (S3)
    // For now, return a placeholder URL
    const filename = `cv-${Date.now()}.pdf`;
    this.cvUrl = `/uploads/cv/${filename}`;
    this.logger.log(`CV upload: ${filename}`);

    return {
      url: this.cvUrl,
    };
  }

  getCurrentCV(): { url: string | null } {
    return {
      url: this.cvUrl || this.configService.get('CV_URL') || null,
    };
  }
}
