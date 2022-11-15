import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Account } from './Account';

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Account, account => account.user)
  account: Account;
}