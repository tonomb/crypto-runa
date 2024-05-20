import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Post()
  create(@Body() transaction: Transaction): Promise<Transaction> {
    return this.transactionService.create(transaction);
  }
}
