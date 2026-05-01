import { Module } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository';
import { CommandHandlers } from './application/use-cases';
import { CustomerController } from './presentation/customer.controller';
import { QueryHandlers } from './application/queries/handlers';
import { NOTIFICATION_SERVICE } from './application/ports/notification.port';
import { ConsoleNotificationAdapter } from './infrastructure/adapters/console-notification.adapter';
import { EventHandlers } from './application/events';

@Module({
  controllers: [CustomerController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
    {
      provide: NOTIFICATION_SERVICE,
      useClass: ConsoleNotificationAdapter,
    },
  ],
})
export class CustomerModule {}
