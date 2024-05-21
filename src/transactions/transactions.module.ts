import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';
import { ProcessedTransactions } from './processedTransactions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, ProcessedTransactions]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
