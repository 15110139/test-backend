import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { SYSTEM_CODE } from 'shared/system-code';
import {
  SignUpWithFirebaseAdminBodyDTO,
  SignUpWithFirebaseAdminResponseDTO,
} from './auth.dto';
import { FireBaseService } from '../firebase-admin/firebase.service';
import * as uuid from 'uuid';
import { UserRepository } from 'database/repository/user-repository/user.repository';
import { UserEntity } from 'database/entities/user.entity';

@Injectable()
export class AuthService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly firebaseAdminService: FireBaseService,
    private readonly userRepo: UserRepository,
  ) {}

  public async signInWithFirebaseAdmin(
    data: SignUpWithFirebaseAdminBodyDTO,
  ): Promise<SignUpWithFirebaseAdminResponseDTO> {
    const listUser = await this.firebaseAdminService.getUsers([
      {
        email: data.email,
        phoneNumber: data.phoneNumber,
      },
    ]);

    if (listUser.users.length > 0) {
      this.logger.error(`Exist user in firebase database`);
      throw new BadRequestException(
        SYSTEM_CODE.ALREADY_EXISTS_PROFILE_IN_SYSTEM,
      );
    }
    const userId = uuid.v4();
    await this.firebaseAdminService.createUser({
      email: data.email,
      displayName: data.displayName,
      uid: userId,
      password: data.password,
      photoURL: data.photoUrl,
      phoneNumber: data.phoneNumber,
    });

    const newUserData = new UserEntity();
    newUserData.id = userId;
    newUserData.name = data.name;
    newUserData.dateOfBirth = data.dateOfDate;

    await this.userRepo.createUser(newUserData);

    return {
      token: await this.firebaseAdminService.createCustomerToken(userId),
    };
  }
}
