import {
  Body,
  Controller,
  Headers,
  Inject,
  Logger,
  LoggerService,
  Post,
  RawBody,
} from '@nestjs/common';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { CommandBus } from '@nestjs/cqrs';
import {
  PAYMENT_GATEWAY,
  PaymentGatewayPort,
} from '../ports/payment-gateway.port';
import { CreatePaymentCommand } from '../application/use-cases/create-payment/create-payment.command';
import { ConfirmPaymentCommand } from '../application/use-cases/confirm-payment/confirm-payment.command';

@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly commandBus: CommandBus,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  @Post()
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.commandBus.execute(
      new CreatePaymentCommand(dto.orderId, dto.successUrl, dto.cancelUrl),
    );
  }

  @Post('webhook')
  async handleWebhook(
    @RawBody() payload: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.paymentGateway.constructWebhookEvent(payload, signature);
    this.logger.log('Got stripe webhook event', event);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const paymentId = session.metadata?.paymentId;
        const gatewayTransactionId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id;

        if (paymentId && gatewayTransactionId) {
          await this.commandBus.execute(
            new ConfirmPaymentCommand(paymentId, gatewayTransactionId),
          );
        }
        break;
      }
      default:
        break;
    }
  }
}
