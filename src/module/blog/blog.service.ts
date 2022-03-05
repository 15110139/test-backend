import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BlogRepository } from 'database/repository/blog-repository/blog.repository';
import { SYSTEM_CODE } from 'shared/system-code';
import {
  CreateBlogBodyDTO,
  CreateBlogResponseDTO,
  GetBlogResponseDTO,
  UpdateBlogBodyDTO,
} from './blog.dto';
import * as uuid from 'uuid';
import { BlogEntity } from 'database/entities/blog.entity';
import { FireBaseService } from '../firebase-admin/firebase.service';

@Injectable()
export class BlogService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly blogRepo: BlogRepository,
    private readonly firebaseAdminService: FireBaseService,
  ) {}
  public async createBlog(
    data: CreateBlogBodyDTO,
    userId?: string,
  ): Promise<CreateBlogResponseDTO> {
    const existBlogWithTitle = await this.blogRepo.getBlogByCondition({
      title: data.title,
    });

    if (existBlogWithTitle) {
      this.logger.log(`Exist blog title in system`);
      throw new BadRequestException(SYSTEM_CODE.ALREADY_BLOG_TITLE_IN_SYSTEM);
    }
    const blogId = uuid.v4();

    const blog = new BlogEntity();
    blog.id = blogId;
    blog.content = data.content;
    blog.title = data.title;
    if (userId) {
      blog.userId = userId;
    }

    await this.blogRepo.createBlog(blog);
    await this.firebaseAdminService.createBlog(blog);

    return {
      content: blog.content,
      id: blog.id,
      title: blog.title,
      userId: blog.userId,
      createDate: blog.createDate,
    };
  }

  public async getBlog(blogId: string): Promise<GetBlogResponseDTO | null> {
    const blog = await this.blogRepo.getBlog(blogId);
    if (!blog) {
      return null;
    }

    return {
      id: blog.id,
      content: blog.content,
      createDate: blog.createDate,
      title: blog.title,
      userId: blog.userId,
    };
  }

  public async updateBlog(
    blogId: string,
    dataUpdate: UpdateBlogBodyDTO,
  ): Promise<void> {
    this.validateDataUpdate(dataUpdate);

    const blog = await this.blogRepo.getBlog(blogId);

    if (!blog) {
      this.logger.error(`Blog not found`);
      throw new BadRequestException(SYSTEM_CODE.BLOG_NOT_FOUND);
    }

    const blogUpdateData = new BlogEntity();
    if (dataUpdate.title) {
      blogUpdateData.title = dataUpdate.title;
    }

    if (dataUpdate.content) {
      blogUpdateData.content = dataUpdate.content;
    }

    await this.blogRepo.updateBlog(blogId, blogUpdateData);

    await this.firebaseAdminService.updateBlog(blogId, blogUpdateData);
  }

  public async deleteBlog(blogId: string) {
    const blog = await this.blogRepo.getBlog(blogId);
    if (!blog) {
      this.logger.error(`Blog not found`);
      throw new BadRequestException(SYSTEM_CODE.BLOG_NOT_FOUND);
    }
    await this.blogRepo.deleteBlog(blogId);
    await this.firebaseAdminService.deleteBlog(blogId);
  }

  private validateDataUpdate(dataUpdate: UpdateBlogBodyDTO) {
    if (!dataUpdate.title && !dataUpdate.content) {
      this.logger.error(`Please update something`);
      throw new BadRequestException(SYSTEM_CODE.PLEASE_UPDATE_SOMETHING);
    }
  }
}
