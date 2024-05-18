import { Controller, Get } from '@nestjs/common';
import { DepositsService } from './deposits.service';

@Controller('deposits')
export class DepositsController {
  constructor(private depositsService: DepositsService) {}

  @Get()
  run() {
    return this.depositsService.validate();
  }

  @Get('transactions')
  async getTransactions() {
    const transactions = await this.depositsService.allTransactions();

    return transactions;
  }
}
