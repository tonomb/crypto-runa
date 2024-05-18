import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';

@Injectable()
export class DepositsRepository {
  async findAll() {
    const contents = await readFile('transactions-2.json', 'utf-8');
    const transactions = JSON.parse(contents);

    return transactions;
  }
}
