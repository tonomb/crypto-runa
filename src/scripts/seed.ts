import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TransactionsService } from '../transactions/transactions.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const transactionsService = app.get(TransactionsService);

  await transactionsService.seedUsers();
  console.log('Users Seeded Complete');

  await transactionsService.seedTransactions('transactions-1');
  console.log('Transactions 1 Seeded Complete');

  await transactionsService.seedTransactions('transactions-2');
  console.log('Transactions 2 Seeded Complete');
  await app.close();
}

bootstrap();
