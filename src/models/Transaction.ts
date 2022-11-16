import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Account } from "./Account";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Account, (account) => account.debitTransactions)
  @JoinColumn()
  debitedAccount: Account;

  @ManyToOne(() => Account, (account) => account.creditTransactions)
  @JoinColumn()
  creditedAccount: Account;

  @Column({ type: "real" })
  value: number;

  @Column({ type: "timestamp" })
  createdAt: Date;
}