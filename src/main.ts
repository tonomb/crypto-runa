import { NestFactory } from '@nestjs/core';
import { DepositsModule } from './deposits/deposits.module';

async function bootstrap() {
  const app = await NestFactory.create(DepositsModule);
  await app.listen(3000);
}
bootstrap();
