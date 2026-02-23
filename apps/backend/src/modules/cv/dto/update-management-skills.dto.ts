import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsUUID,
  Min,
  Max,
  MinLength,
  MaxLength,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ManagementSkillDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsInt()
  @Min(1)
  @Max(100)
  percentage: number;
}

export class UpdateManagementSkillsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManagementSkillDto)
  @ArrayMaxSize(10)
  skills: ManagementSkillDto[];
}
