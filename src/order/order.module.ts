import { Module } from '@nestjs/common';
import { ORDER_REPOSITORY } from './application/ports/order.repository.port';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository';
import { CommandHandlers } from './application/use-cases';
import { OrderController } from './presentation/order.controller';
import { CUSTOMER } from './application/ports/customer.port';
import { CustomerAdapter } from './infrastructure/adapters/customer.adapter';
import { PRODUCT } from './application/ports/product.port';
import { ProductAdapter } from './infrastructure/adapters/product.adapter';
import { CustomerModule } from '../customers/customer.module';
import { ProductModule } from '../product/product.module';
import { EventHandlers } from './application/events';
import { QueryHandlers } from './application/queries/handlers';
import { OrderFulfillmentSaga } from './application/sagas/order-fulfillment.saga';

@Module({
  imports: [CustomerModule, ProductModule],
  controllers: [OrderController],
  exports: [ORDER_REPOSITORY],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    OrderFulfillmentSaga,
    {
      provide: ORDER_REPOSITORY,
      useClass: DrizzleOrderRepository,
    },
    {
      provide: CUSTOMER,
      useClass: CustomerAdapter,
    },
    {
      provide: PRODUCT,
      useClass: ProductAdapter,
    },
  ],
})
export class OrderModule {}
