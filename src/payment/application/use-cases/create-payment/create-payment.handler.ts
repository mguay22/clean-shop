import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentCommand } from './create-payment.command';
import { UniqueId } from '../../../../shared/domain/value-objects/unique-id.vo';
import { Inject } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  PaymentRepository,
} from '../../ports/payment.repository.port';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception';
import {
  ORDER_PRICING,
  OrderPricingPort,
} from '../../ports/order-pricing.port';
import { Payment } from '../../../domain/entities/payment.entity';
import {
  PAYMENT_GATEWAY,
  PaymentGatewayPort,
} from '../../../ports/payment-gateway.port';

interface CreatePaymentResponse {
  checkoutUrl: string;
  paymentId: string;
}

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<
  CreatePaymentCommand,
  CreatePaymentResponse
> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    @Inject(ORDER_PRICING)
    private readonly orderPricing: OrderPricingPort,
    private readonly eventPublisher: EventPublisher,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<CreatePaymentResponse> {
    const orderId = new UniqueId(command.orderId);
    const existing = await this.paymentRepository.findByOrderId(orderId);

    if (existing?.isSucceeded()) {
      throw new ApplicationException(
        `Order with ID ${command.orderId} has already been paid`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const pricing = await this.orderPricing.getOrderPricing(command.orderId);
    if (!pricing) {
      throw new ApplicationException(
        `Order with ID ${command.orderId} not found`,
      );
    }

    let payment: Payment;
    if (existing) {
      payment = this.eventPublisher.mergeObjectContext(existing);
    } else {
      payment = this.eventPublisher.mergeObjectContext(
        Payment.initiate(orderId.getValue(), pricing.total),
      );
    }

    const { url } = await this.paymentGateway.createCheckoutSession(
      pricing.lines,
      { orderId: command.orderId, paymentId: payment.id.getValue() },
      { successUrl: command.successUrl, cancelUrl: command.cancelUrl },
    );

    payment.startCheckout();

    await this.paymentRepository.save(payment);

    payment.commit();

    return { paymentId: payment.id.getValue(), checkoutUrl: url };
  }
}
