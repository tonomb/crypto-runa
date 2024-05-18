import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { DepositsRepository } from './deposits.repository';

@Module({
  providers: [DepositsService, DepositsRepository],
  controllers: [DepositsController],
})
export class DepositsModule {}
