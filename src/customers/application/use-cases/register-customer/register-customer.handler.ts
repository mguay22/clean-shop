import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCustomerCommand } from './register-customer.command';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepositoryPort,
} from '../../ports/customer.repository.port';
import { Inject } from '@nestjs/common';
import { Email } from '../../../domain/value-objects/email.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception';
import { Customer } from '../../../domain/entities/customer.entity';

@CommandHandler(RegisterCustomerCommand)
export class RegisterCustomerHandler implements ICommandHandler<
  RegisterCustomerCommand,
  void
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RegisterCustomerCommand): Promise<void> {
    const email = Email.create(command.email);

    const existing = await this.customerRepository.findByEmail(email);
    if (existing) {
      throw new ApplicationException(
        `Customer with email ${email.getValue()} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const customer = this.eventPublisher.mergeObjectContext(
      Customer.register(
        email,
        command.firstName,
        command.lastName,
        command.phone,
      ),
    );

    await this.customerRepository.save(customer);

    customer.commit();
  }
}
