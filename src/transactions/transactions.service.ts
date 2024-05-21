import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';
import { readFile } from 'fs/promises';

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

  async seedUsers() {
    const contents = await readFile('users.json', 'utf-8');
    const users = JSON.parse(contents);
    await this.userRepository.save(users);
  }

  async seedTransactions(fileName: string) {
    const contents = await readFile(`${fileName}.json`, 'utf-8');
    const transactions = JSON.parse(contents).transactions;
    await this.transactionRepository.save(transactions);
  }
}
