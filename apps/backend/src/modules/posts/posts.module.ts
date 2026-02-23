import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { CategoriesController } from './categories.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { Category } from './entities/category.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category]), AuthModule],
  controllers: [PostsController, CategoriesController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
