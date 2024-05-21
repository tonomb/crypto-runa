import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  address: string;

  @Column()
  name: string;

  @Column()
  balance: number;

  @Column()
  transactions: number;
}
