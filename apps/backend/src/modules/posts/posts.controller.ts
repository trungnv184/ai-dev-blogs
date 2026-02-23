import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('published') publishedStr?: string,
  ) {
    // Convert string 'true'/'false' to boolean, or undefined if not provided
    let published: boolean | undefined;
    if (publishedStr === 'true') published = true;
    else if (publishedStr === 'false') published = false;

    return this.postsService.findAll({
      page,
      limit,
      category,
      search,
      published,
    });
  }

  @Get('by-id/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findById(id);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    await this.postsService.incrementViewCount(slug);
    return this.postsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.delete(id);
  }
}
