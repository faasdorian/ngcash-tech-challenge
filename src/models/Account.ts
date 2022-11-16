import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Transaction } from "./Transaction";
import { User } from "./User";

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn()
  user: User;

  @Column({ type: "real" })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.debitedAccount)
  debitTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.creditedAccount)
  creditTransactions: Transaction[];
}
