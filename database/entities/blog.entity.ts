import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('t_blog')
export class BlogEntity extends BaseEntity {
  @Column({ name: 'title' })
  public title: string;

  @Column({ name: 'content' })
  public content: string;

  @Column({ name: 'user_id', nullable: true })
  public userId: string;
}
