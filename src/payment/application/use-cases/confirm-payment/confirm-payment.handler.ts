import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmPaymentCommand } from './confirm-payment.command';
import { Inject } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  PaymentRepository,
} from '../../ports/payment.repository.port';
import { PaymentId } from '../../../domain/value-objects/payment-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception';

@CommandHandler(ConfirmPaymentCommand)
export class ConfirmPaymentHandler implements ICommandHandler<
  ConfirmPaymentCommand,
  void
> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ConfirmPaymentCommand): Promise<void> {
    const payment = await this.paymentRepository.findById(
      new PaymentId(command.paymentId),
    );

    if (!payment) {
      throw new ApplicationException(
        `Payment with ID ${command.paymentId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    if (payment.status.isSucceeded()) {
      return;
    }

    const tracked = this.eventPublisher.mergeObjectContext(payment);

    tracked.complete(command.gatewayTransactionId);

    await this.paymentRepository.save(tracked);

    tracked.commit();
  }
}
