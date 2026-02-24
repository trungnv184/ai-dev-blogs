import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * Work history entry stored as JSONB
 */
export interface WorkHistoryEntryData {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  highlights: string[];
  location?: string;
  badges?: string[];
}

/**
 * Education entry stored as JSONB
 */
export interface EducationEntryData {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

@Entity('cv_data')
@Index(['published'])
export class CVDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', default: [] })
  skills: string[];

  @Column({ type: 'jsonb', default: [] })
  workHistory: WorkHistoryEntryData[];

  @Column({ type: 'jsonb', default: [] })
  education: EducationEntryData[];

  @Column({ type: 'varchar', nullable: true })
  pdfFileName: string;

  @Column({ type: 'varchar', nullable: true })
  pdfFilePath: string;

  @Column({ type: 'text', nullable: true })
  pdfData: string;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
