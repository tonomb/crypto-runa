import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TransactionsService } from '../transactions/transactions.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const transactionsService = app.get(TransactionsService);
  await transactionsService.seedUsers();
  await app.close();
}

bootstrap();
