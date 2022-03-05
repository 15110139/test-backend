import { Module } from '@nestjs/common';
import { BlogRepositoryModule } from 'database/repository/blog-repository/blog.repository.module';
import { FireBaseModule } from '../firebase-admin/firbase.module';
import { BlogService } from './blog.service';

@Module({
  imports: [FireBaseModule, BlogRepositoryModule],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
