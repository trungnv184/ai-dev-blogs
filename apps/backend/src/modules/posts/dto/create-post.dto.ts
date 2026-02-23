import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(10, { message: 'Content must be at least 10 characters' })
  content: string;

  @IsString()
  @IsNotEmpty({ message: 'Excerpt is required' })
  @MinLength(10, { message: 'Excerpt must be at least 10 characters' })
  excerpt: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
