import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TransactionsService } from '../transactions/transactions.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const transactionService = app.get(TransactionsService);

  await transactionService.processTransactions();

  await transactionService.generateReport();

  await app.close();
}

bootstrap();
