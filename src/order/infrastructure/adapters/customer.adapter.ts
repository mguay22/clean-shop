import { Inject, Injectable } from '@nestjs/common';
import { CustomerPort } from '../../application/ports/customer.port';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../../customers/application/ports/customer.repository.port';
import { CustomerId } from '../../../customers/domain/value-objects/customer-id.vo';

@Injectable()
export class CustomerAdapter implements CustomerPort {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async exists(customerId: string): Promise<boolean> {
    const customer = await this.customerRepository.findById(
      new CustomerId(customerId),
    );
    return customer !== null;
  }
}
