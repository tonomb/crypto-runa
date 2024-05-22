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
    private processedTransactionsRepository: Repository<ProcessedTransactions>,
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
    try {
      const transactions = await this.transactionRepository.find();

      for (const transaction of transactions) {
        const proccessed = await this.processedTransactionsRepository.findOne({
          where: { txid: transaction.txid },
        });

        if (!proccessed) {
          if (this.validateConfirmation(transaction)) {
            await this.updateUserBalance(transaction);
          }
          await this.markTransactionAsProcessed(transaction.txid);
        } else {
          // Transaction has already been proccessed and user credited, skipping
          // console.log(
          //   `Transaction: ${transaction.txid} has already been processed, skipping`,
          // );
        }
      }
    } catch (error) {
      console.error('Error processing transactions: ', error);
      throw error;
    }
  }

  private validateConfirmation(transaction: Transaction): boolean {
    return transaction.confirmations > 5;
  }

  private async updateUserBalance(transaction: Transaction): Promise<void> {
    try {
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
    } catch (error) {
      console.error('Error updating user balance', error);
      throw error;
    }
  }

  private async updateNoRefferenceBalance(
    transaction: Transaction,
  ): Promise<void> {
    try {
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
    } catch (error) {
      console.error('Error updating no reff', error);
      throw error;
    }
  }

  private async applyTransaction(
    user: User,
    transaction: Transaction,
  ): Promise<void> {
    try {
      if (transaction.category === 'receive') {
        user.balance += transaction.amount;
      } else if (transaction.category === 'send') {
        user.balance -= transaction.amount;
      }

      user.transactions += 1;

      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error applying transaction to user', error);
      throw error;
    }
  }

  private async markTransactionAsProcessed(txid: string): Promise<void> {
    try {
      const processedTransaction = new ProcessedTransactions();
      processedTransaction.txid = txid;
      processedTransaction.processedAt = new Date();

      await this.processedTransactionsRepository.save(processedTransaction);
    } catch (error) {
      console.error('Error marking transaction as processed', error);
      throw error;
    }
  }

  async generateReport() {
    const users = await this.userRepository.find();

    users.forEach((user) => {
      const balanceFormatted = user.balance.toFixed(8); // Format the balance with 8 decimal points

      switch (user.name) {
        case 'No Refferance':
          console.log(
            `Deposited without reference: count=${user.transactions} sum=${balanceFormatted}`,
          );
          break;
        case 'James T. Kirk':
          console.log(
            `Deposited for ${user.name}: count=${user.transactions} sum=${balanceFormatted}`,
          );
          break;
        default:
          console.log(
            `Deposited for ${user.name}: count=${user.transactions} sum=${balanceFormatted}`,
          );
          break;
      }
    });

    const smallestDeposit = await this.getSmallestValidDeposit();
    const largestDeposit = await this.getLargestValidDeposit();

    console.log(`Smallest valid deposit: ${smallestDeposit}`);
    console.log(`Largest valid deposit: ${largestDeposit}`);
  }

  private async getSmallestValidDeposit(): Promise<string> {
    const result = await this.transactionRepository.query(
      `SELECT MIN(amount) as smallest FROM 'transaction' WHERE confirmations > 5 AND category = 'receive'`,
    );
    return parseFloat(result[0].smallest).toFixed(8);
  }

  private async getLargestValidDeposit(): Promise<string> {
    const result = await this.transactionRepository.query(
      `SELECT MAX(amount) as largest FROM 'transaction' WHERE confirmations > 5 AND category = 'receive'`,
    );
    return parseFloat(result[0].largest).toFixed(8);
  }
}
