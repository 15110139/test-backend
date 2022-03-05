import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from 'database/entities/blog.entity';
import { FindConditions, Repository } from 'typeorm';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepo: Repository<BlogEntity>,
  ) {}

  public async createBlog(blog: BlogEntity): Promise<BlogEntity> {
    return await this.blogRepo.save(blog);
  }

  public async getBlog(blogId: string): Promise<BlogEntity> {
    const condition: FindConditions<BlogEntity> = {
      id: blogId,
      deleted: false,
    };
    return await this.blogRepo.findOne(condition);
  }

  public async listBlog(skip: number, take: number): Promise<BlogEntity[]> {
    return await this.blogRepo.find({
      where: {
        deleted: false,
      },
      skip,
      take,
    });
  }

  public async updateBlog(
    blogId: string,
    dataUpdate: Omit<BlogEntity, 'id' | 'del'>,
  ): Promise<void> {
    await this.blogRepo.update({ id: blogId }, dataUpdate);
  }

  public async deleteBlog(blogId: string): Promise<void> {
    await this.blogRepo.update(
      { id: blogId },
      {
        deleted: true,
      },
    );
  }

  public async getBlogByCondition(
    condition: FindConditions<BlogEntity>,
  ): Promise<BlogEntity> {
    condition.deleted = false;
    return await this.blogRepo.findOne(condition);
  }
}
