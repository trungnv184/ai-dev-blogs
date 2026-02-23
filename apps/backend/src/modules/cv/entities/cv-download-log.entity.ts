import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('cv_download_logs')
@Index(['downloadedAt'])
export class CVDownloadLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  userAgent: string | null;

  @Column({ type: 'varchar', nullable: true, length: 45 })
  ipAddress: string | null;

  @CreateDateColumn()
  downloadedAt: Date;
}
