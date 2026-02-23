import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { EmailService } from './email.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private contactRepository: Repository<ContactMessage>,
    private emailService: EmailService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const message = this.contactRepository.create(createContactDto);
    const savedMessage = await this.contactRepository.save(message);

    // Send notification email
    await this.emailService.sendContactNotification(createContactDto);

    return {
      message: 'Your message has been sent successfully',
      id: savedMessage.id,
    };
  }

  async findAll() {
    return this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string) {
    await this.contactRepository.update(id, { read: true });
    return { message: 'Message marked as read' };
  }
}
