import { Module } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from './application/ports/payment.repository.port';
import { DrizzlePaymentRepository } from './infrastructure/adapters/drizzle-payment.repository';
import { PAYMENT_GATEWAY } from './ports/payment-gateway.port';
import { StripePaymentAdapter } from './infrastructure/adapters/stripe-payment.adapter';

@Module({
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripePaymentAdapter,
    },
  ],
})
export class PaymentModule {}
