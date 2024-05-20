import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  create(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }
}
