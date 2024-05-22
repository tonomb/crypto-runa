import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions/transactions.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.join(__dirname, '..', 'database', 'database.sqlite'),
      entities: [path.join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: true,
    }),
    TransactionsModule,
  ],
})
export class AppModule {}
