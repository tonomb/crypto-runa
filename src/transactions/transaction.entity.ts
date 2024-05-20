import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionId: string;

  @Column()
  amount: number;

  @Column()
  confirmations: number;

  @Column()
  address: string;
}
