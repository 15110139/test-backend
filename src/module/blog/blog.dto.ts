import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

@Exclude()
export class CreateBlogBodyDTO {
  @Expose()
  @IsString()
  public title!: string;

  @Expose()
  @IsString()
  public content!: string;
}

export class BlogItemDTO {
  @Expose()
  @IsString()
  public id!: string;

  @Expose()
  @IsString()
  public title!: string;

  @Expose()
  @IsString()
  public content!: string;

  @Expose()
  @IsString()
  @IsOptional()
  public userId?: string;

  @Expose()
  @IsDate()
  public createDate!: Date;
}

export class BlogIdParam {
  @Expose()
  @IsString()
  public blogId!: string;
}

@Exclude()
export class CreateBlogResponseDTO extends BlogItemDTO {}

@Exclude()
export class GetBlogResponseDTO extends BlogItemDTO {}

@Exclude()
export class UpdateBlogBodyDTO {
  @Expose()
  @IsString()
  @IsOptional()
  public title?: string;

  @Expose()
  @IsString()
  @IsOptional()
  public content?: string;
}
