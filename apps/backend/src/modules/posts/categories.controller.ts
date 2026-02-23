import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    return this.postsService.findAllCategories();
  }
}
