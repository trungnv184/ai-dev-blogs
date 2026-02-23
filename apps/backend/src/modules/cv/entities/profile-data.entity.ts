import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Contact information stored as JSONB
 */
export interface ContactInfoData {
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

@Entity('profile_data')
export class ProfileDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  locationUrl?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  profileImagePath?: string;

  @Column({ type: 'jsonb', default: {} })
  contacts: ContactInfoData;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
