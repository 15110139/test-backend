import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('t_user')
export class UserEntity extends BaseEntity {
  @Column({
    name: 'name',
  })
  public name!: string;

  @Column({
    name: 'date_of_birth',
  })
  public dateOfBirth!: Date;

  @Column({
    name: 'email',
  })
  public email!: string;

  @Column({
    name: 'password',
  })
  public password!: string;

  @Column({
    name: 'photo_url',
  })
  public photoURL?: string;

  @Column({
    name: 'phone_number',
  })
  public phonNumber!: string;
}
