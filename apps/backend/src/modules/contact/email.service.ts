import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendContactNotification(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    // TODO: Implement actual email sending with SendGrid or Nodemailer
    this.logger.log(`Contact notification would be sent:`);
    this.logger.log(`From: ${data.name} <${data.email}>`);
    this.logger.log(`Subject: ${data.subject || 'No subject'}`);
    this.logger.log(`Message: ${data.message}`);

    // Placeholder for actual implementation
    return { sent: true };
  }
}
