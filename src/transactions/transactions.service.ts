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

  async processTransactions(): Promise<void> {
    const transactions = await this.transactionRepository.find();

    for (const transaction of transactions) {
      if (this.validateConfirmation(transaction)) {
        await this.updateUserBalance(transaction);
      }
    }
  }

  private validateConfirmation(transaction: Transaction): boolean {
    return transaction.confirmations > 5;
  }

  private async updateUserBalance(transaction: Transaction): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        address: transaction.address,
      },
    });

    if (user) {
      await this.applyTransaction(user, transaction);
    } else {
      // NO Address Exists, add balance to unknown address
      await this.updateNoRefferenceBalance(transaction);
    }
  }

  private async updateNoRefferenceBalance(
    transaction: Transaction,
  ): Promise<void> {
    const noReff = await this.userRepository.findOne({
      where: {
        address: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    });

    if (noReff) {
      await this.applyTransaction(noReff, transaction);
    } else {
      console.warn(
        'No Reff user not found. Ensure the database was seeded properly',
      );
    }
  }

  private async applyTransaction(
    user: User,
    transaction: Transaction,
  ): Promise<void> {
    if (transaction.category === 'receive') {
      user.balance += transaction.amount;
    } else if (transaction.category === 'send') {
      user.balance -= transaction.amount;
    }

    user.transactions += 1;

    await this.userRepository.save(user);
  }
}
