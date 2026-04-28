import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerQuery } from '../get-customer.query';
import { Customer } from '../../../domain/entities/customer.entity';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../ports/customer.repository.port';
import { CustomerId } from '../../../domain/value-objects/customer-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<
  GetCustomerQuery,
  Customer
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.customerRepository.findById(
      new CustomerId(query.customerId),
    );

    if (!customer) {
      throw new ApplicationException(
        `Customer with id ${query.customerId} not found.`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return customer;
  }
}
