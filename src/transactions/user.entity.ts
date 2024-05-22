import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  address: string;

  @Column()
  name: string;

  @Column('float')
  balance: number;

  @Column()
  transactions: number;
}
