// Import firebase-admin
import { Injectable, Logger } from '@nestjs/common';
import { OnApplicationBootstrap } from '@nestjs/common';
import { BlogEntity } from 'database/entities/blog.entity';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { CreateRequest } from 'firebase-admin/lib/auth/auth-config';
import { GetUsersResult } from 'firebase-admin/lib/auth/base-auth';
import { UserIdentifier } from 'firebase-admin/lib/auth/identifier';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { EnvironmentService } from '../environment/environment.service';
export enum FIREBASE_DATABASE {
  BLOG = 'blog',
}

@Injectable()
export class FireBaseService implements OnApplicationBootstrap {
  private logger = new Logger(this.constructor.name);
  constructor(private envService: EnvironmentService) {}
  private firebaseAdmin: admin.app.App;
  public async onApplicationBootstrap() {
    try {
      const adminConfig: ServiceAccount = {
        projectId: this.envService.ENVIRONMENT.FIREBASE_PROJECT_ID,
        privateKey: this.envService.ENVIRONMENT.FIREBASE_PRIVATE_KEY.replace(
          /\\n/g,
          '\n',
        ),
        clientEmail: this.envService.ENVIRONMENT.FIREBASE_CLIENT_EMAIL,
      };
      // Initialize the firebase admin app
      this.firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
        databaseURL: this.envService.ENVIRONMENT.DATABASE_FIREBASE_URL,
      });
    } catch (error) {
      this.logger.error(`Init firebase admin failed`);
      process.exit(1);
    }
  }

  public async getUserByEmail(email: string): Promise<UserRecord> {
    return await this.firebaseAdmin.auth().getUserByEmail(email);
  }

  public async getUsers(
    identifiers: UserIdentifier[],
  ): Promise<GetUsersResult> {
    return await this.firebaseAdmin.auth().getUsers(identifiers);
  }

  public async createUser(data: CreateRequest): Promise<UserRecord> {
    return await this.firebaseAdmin.auth().createUser(data);
  }

  public async createCustomerToken(userId: string): Promise<string> {
    return await this.firebaseAdmin.auth().createCustomToken(userId);
  }

  public async createBlog(blog: BlogEntity) {
    await this.firebaseAdmin
      .database()
      .ref(FIREBASE_DATABASE.BLOG + '/' + blog.id)
      .set({
        userId: blog.userId,
        title: blog.title,
        content: blog.content,
      });
  }

  public async updateBlog(blogId: string, dataUpdate: BlogEntity) {
    await this.firebaseAdmin
      .database()
      .ref(FIREBASE_DATABASE.BLOG + '/' + blogId)
      .set(dataUpdate);
  }

  public async deleteBlog(blogId: string) {
    await this.firebaseAdmin
      .database()
      .ref(FIREBASE_DATABASE.BLOG + '/' + blogId)
      .remove();
  }
}
