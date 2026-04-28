import { Module } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository';
import { CommandHandlers } from './application/use-cases';
import { CustomerController } from './presentation/customer.controller';
import { QueryHandlers } from './application/queries/handlers';

@Module({
  controllers: [CustomerController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
  ],
})
export class CustomerModule {}
