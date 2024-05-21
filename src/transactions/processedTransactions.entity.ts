import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class ProcessedTransactions {
  @PrimaryColumn()
  txid: string;

  @Column()
  processedAt: Date;
}
