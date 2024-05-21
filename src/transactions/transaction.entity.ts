import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryColumn()
  txid: string;

  @Column({ nullable: true })
  involvesWatchonly: boolean;

  @Column({ nullable: true })
  account: string;

  @Column()
  address: string;

  @Column()
  category: string;

  @Column('float')
  amount: number;

  @Column({ nullable: true })
  label: string;

  @Column()
  confirmations: number;

  @Column()
  blockhash: string;

  @Column()
  blockindex: number;

  @Column()
  blocktime: number;

  @Column()
  vout: number;

  @Column('simple-array')
  walletconflicts: string[];

  @Column()
  time: number;

  @Column()
  timereceived: number;

  @Column({ name: 'bip125_replaceable', nullable: true })
  bip125Replaceable: string;
}
