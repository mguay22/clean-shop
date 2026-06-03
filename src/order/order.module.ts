import { Module } from '@nestjs/common';
import { ORDER_REPOSITORY } from './domain/ports/order.repository.port';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository';

@Module({
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: DrizzleOrderRepository,
    },
  ],
})
export class OrderModule {}
