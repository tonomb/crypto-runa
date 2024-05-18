import { Injectable } from '@nestjs/common';
import { DepositsRepository } from './deposits.repository';

@Injectable()
export class DepositsService {
  constructor(private depositsRepo: DepositsRepository) {}

  validate() {
    return 'Transactions Validated';
  }

  allTransactions() {
    return this.depositsRepo.findAll();
  }
}
