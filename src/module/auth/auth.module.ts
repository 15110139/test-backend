import { Module } from '@nestjs/common';
import { UserRepositoryModule } from 'database/repository/user-repository/user.repository.module';
import { FireBaseModule } from '../firebase-admin/firbase.module';
import { AuthService } from './auth.service';

@Module({
  imports: [UserRepositoryModule, FireBaseModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
