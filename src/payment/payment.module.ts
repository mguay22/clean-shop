import { Module } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from './application/ports/payment.repository.port';
import { DrizzlePaymentRepository } from './infrastructure/adapters/drizzle-payment.repository';

@Module({
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
  ],
})
export class PaymentModule {}
