import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ name: 'create_date' })
  public createDate: Date;

  @Column({ name: 'modify_date' })
  public modifyDate: Date;

  @Column({ name: 'deleted' })
  public deleted: boolean;

  @BeforeInsert()
  protected generateDateBeforeInsert(): void {
    this.createDate = new Date();
    this.modifyDate = this.createDate;
  }

  @BeforeUpdate()
  protected generateDateBeforeUpdate(): void {
    this.modifyDate = new Date();
  }
}
