import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WorkHistoryEntryDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  company: string;

  @IsString()
  role: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsBoolean()
  current: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  highlights: string[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  badges?: string[];
}

export class EducationEntryDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  institution: string;

  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsBoolean()
  current: boolean;
}

export class UpdateCVDto {
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkHistoryEntryDto)
  workHistory: WorkHistoryEntryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationEntryDto)
  education?: EducationEntryDto[];
}
