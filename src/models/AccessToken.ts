import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AccessToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  token: string;

  @Column({ type: "timestamp" })
  tokenExpires: Date;
}
