import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';
import { ProcessedTransactions } from './processedTransactions.entity';
import { readFile } from 'fs/promises';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProcessedTransactions)
    private processedTransactions: Repository<ProcessedTransactions>,
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
    const transactionsData = JSON.parse(contents).transactions;

    const uniqueTransactions = [];
    const seenTxids = new Set();

    transactionsData.forEach((transaction) => {
      if (!seenTxids.has(transaction.txid)) {
        uniqueTransactions.push(transaction);
        seenTxids.add(transaction.txid);
      }
    });

    await this.transactionRepository.save(uniqueTransactions);
  }
}
