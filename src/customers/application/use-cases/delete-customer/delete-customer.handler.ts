import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCustomerCommand } from './delete-customer.command';
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

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<
  DeleteCustomerCommand,
  void
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    const customerId = new CustomerId(command.customerId);
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new ApplicationException(
        `Customer with ID ${command.customerId} not found.`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    await this.customerRepository.delete(customerId);
  }
}
