import { Module } from '@nestjs/common';
import { ORDER_REPOSITORY } from './domain/ports/order.repository.port';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository';
import { CommandHandlers } from './application/use-cases';
import { OrderController } from './presentation/order.controller';

@Module({
  controllers: [OrderController],
  providers: [
    ...CommandHandlers,
    {
      provide: ORDER_REPOSITORY,
      useClass: DrizzleOrderRepository,
    },
  ],
})
export class OrderModule {}
