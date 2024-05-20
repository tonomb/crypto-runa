import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  create(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }
}
