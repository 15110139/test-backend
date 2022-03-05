import { Module } from '@nestjs/common';
import { EnvironmentModule } from '../environment/environment.module';
import { FireBaseService } from './firebase.service';

@Module({
  imports: [EnvironmentModule],
  providers: [FireBaseService],
  exports: [FireBaseService],
})
export class FireBaseModule {}
