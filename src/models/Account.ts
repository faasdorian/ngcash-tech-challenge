import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn()
  user: User;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  balance: number;
}
