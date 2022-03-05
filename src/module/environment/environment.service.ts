import { Injectable, Logger } from '@nestjs/common';
import { Expose, plainToClass, Type } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class Environment {
  @Expose()
  @IsNumber()
  @Type(() => Number)
  public API_PORT = 3000;

  @Expose()
  @IsString()
  public DB_HOST!: string;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  public DB_PORT = 10000000;

  @Expose()
  @IsString()
  public DB_USER!: string;

  @Expose()
  @IsString()
  public DB_NAME!: string;

  @Expose()
  @IsString()
  public DB_PASSWORD!: string;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  public DB_CONNECTION_LIMIT = 10000000;

  @Expose()
  @IsString()
  public FIREBASE_PROJECT_ID!: string;

  @Expose()
  @IsString()
  public FIREBASE_PRIVATE_KEY!: string;

  @Expose()
  @IsString()
  public FIREBASE_CLIENT_EMAIL!: string;

  @Expose()
  @IsString()
  public DATABASE_FIREBASE_URL!: string;
}

@Injectable()
export class EnvironmentService {
  protected logger = new Logger(EnvironmentService.name);

  public readonly ENVIRONMENT: Environment;

  constructor() {
    let config: any;
    try {
      config = dotenv.parse(fs.readFileSync('.env'));
    } catch (error) {
      this.logger.warn(`System will get env from process`);
      config = process.env;
    }
    this.ENVIRONMENT = plainToClass(
      Environment,
      {
        ...new Environment(), // Include default value
        ...config, // ENV override
      },
      { excludeExtraneousValues: true },
    );
    const res = validateSync(this.ENVIRONMENT);
    if (res.length) {
      this.logger.log(this.ENVIRONMENT);
      throw res;
    }
  }
}
