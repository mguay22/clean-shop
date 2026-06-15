import { Module } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository';
import { CommandHandlers } from './application/use-cases';
import { CustomerController } from './presentation/customer.controller';
import { QueryHandlers } from './application/queries/handlers';
import { NOTIFICATION_SERVICE } from './application/ports/notification.port';
import { EventHandlers } from './application/events';
import { NodemailerEmailAdapter } from './infrastructure/adapters/nodemailer-notification.adapter';

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
      useClass: NodemailerEmailAdapter,
    },
  ],
  exports: [CUSTOMER_REPOSITORY, NOTIFICATION_SERVICE],
})
export class CustomerModule {}
