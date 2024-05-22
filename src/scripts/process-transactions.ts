import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TransactionsService } from '../transactions/transactions.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const transactionsService = app.get(TransactionsService);

  await transactionsService.seedUsers();

  await transactionsService.seedTransactions('transactions-1');

  await transactionsService.seedTransactions('transactions-2');

  console.log('Seeded database');
  console.log('----------');

  await transactionsService.processTransactions();

  await transactionsService.generateReport();

  await app.close();
}

bootstrap();
