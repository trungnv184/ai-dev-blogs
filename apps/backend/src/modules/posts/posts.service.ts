import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Category } from './entities/category.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(options: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    published?: boolean;
  }) {
    const { page = 1, limit = 10, category, search, published } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category');

    if (published !== undefined) {
      queryBuilder.andWhere('post.published = :published', { published });
    }

    if (category) {
      queryBuilder.andWhere('category.slug = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.excerpt ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy('post.publishedAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [posts, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: posts,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findBySlug(slug: string) {
    const post = await this.postRepository.findOne({
      where: { slug },
      relations: ['category'],
    });

    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return post;
  }

  async findById(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!post) {
      throw new NotFoundException(`Post with id "${id}" not found`);
    }

    return post;
  }

  async create(createPostDto: CreatePostDto) {
    const slug = this.generateSlug(createPostDto.title);
    const readingTime = this.calculateReadingTime(createPostDto.content);

    const post = this.postRepository.create({
      ...createPostDto,
      slug,
      readingTime,
      publishedAt: createPostDto.published ? new Date() : undefined,
    });

    return this.postRepository.save(post);
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findById(id);

    if (updatePostDto.title && updatePostDto.title !== post.title) {
      (updatePostDto as any).slug = this.generateSlug(updatePostDto.title);
    }

    if (updatePostDto.content) {
      (updatePostDto as any).readingTime = this.calculateReadingTime(
        updatePostDto.content,
      );
    }

    if (updatePostDto.published && !post.published) {
      (updatePostDto as any).publishedAt = new Date();
    }

    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }

  async delete(id: string) {
    const post = await this.findById(id);
    await this.postRepository.remove(post);
    return { message: 'Post deleted successfully' };
  }

  async incrementViewCount(slug: string) {
    await this.postRepository.increment({ slug }, 'viewCount', 1);
  }

  async findAllCategories() {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .loadRelationCountAndMap('category.postCount', 'category.posts')
      .getMany();

    return categories;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
