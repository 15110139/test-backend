import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { typeormModule } from 'database/typeorm.module';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { AuthController } from './module/auth/auth.controller';
import { AuthModule } from './module/auth/auth.module';
import { BlogController } from './module/blog/blog.controller';
import { BlogModule } from './module/blog/blog.module';
import { EnvironmentModule } from './module/environment/environment.module';
@Module({
  imports: [EnvironmentModule, typeormModule(), BlogModule, AuthModule],
  controllers: [AuthController, BlogController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
