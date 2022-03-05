import { Exclude, Expose, Type } from 'class-transformer';
import { IsString, IsDate, IsEmail, IsOptional } from 'class-validator';

@Exclude()
export class SignUpWithFirebaseAdminBodyDTO {
  @Expose()
  @IsEmail()
  public email!: string;

  @Expose()
  @IsString()
  public password!: string;

  @Expose()
  @IsString()
  public displayName!: string;

  @Expose()
  @IsString()
  public name!: string;

  @Expose()
  @Type(() => Date)
  @IsDate()
  public dateOfDate!: Date;

  @Exclude()
  @IsString()
  @IsOptional()
  public photoUrl?: string;

  @Expose()
  @IsString()
  public phoneNumber!: string;
}

export class SignUpWithFirebaseAdminResponseDTO {
  @Expose()
  @IsString()
  public token!: string;
}

export interface IFirebaseUser {
  email: string;

  password: string;

  displayName: string;

  photoUrl: string;
}
