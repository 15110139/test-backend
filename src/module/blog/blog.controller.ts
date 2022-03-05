import { Body, Post, Param, Delete, Put, Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ROUTE } from 'shared/route';
import {
  BlogIdParam,
  CreateBlogBodyDTO,
  CreateBlogResponseDTO,
  GetBlogResponseDTO,
  UpdateBlogBodyDTO,
} from './blog.dto';
import { BlogService } from './blog.service';

@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post(ROUTE.CREATE_BLOG)
  public async createBlog(
    @Body() body: CreateBlogBodyDTO,
  ): Promise<CreateBlogResponseDTO> {
    return await this.blogService.createBlog(body);
  }

  @Get(ROUTE.GET_BLOG)
  public async get(
    @Param() params: BlogIdParam,
  ): Promise<GetBlogResponseDTO | null> {
    return await this.blogService.getBlog(params.blogId);
  }

  @Put(ROUTE.UPDATE_BLOG)
  public async list(
    @Body() body: UpdateBlogBodyDTO,
    @Param() params: BlogIdParam,
  ): Promise<void> {
    return await this.blogService.updateBlog(params.blogId, body);
  }

  @Delete(ROUTE.DELETE_BLOG)
  public async update(@Param() params: BlogIdParam): Promise<void> {
    return await this.blogService.deleteBlog(params.blogId);
  }
}
