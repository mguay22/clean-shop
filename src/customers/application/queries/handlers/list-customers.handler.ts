import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCustomersQuery } from '../list-customers.query';
import { Customer } from '../../../domain/entities/customer.entity';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../ports/customer.repository.port';

@QueryHandler(ListCustomersQuery)
export class ListCustomersHandler implements IQueryHandler<
  ListCustomersQuery,
  Customer[]
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(query: ListCustomersQuery): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}
