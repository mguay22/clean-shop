import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../../application/ports/payment.repository.port';
import {
  DRIZZLE,
  DrizzleDB,
} from '../../../shared/infrastructure/database/postgres/drizzle.provider';
import { Payment } from '../../domain/entities/payment.entity';
import { payments } from '../../../shared/infrastructure/database/postgres/schema';
import { UniqueId } from '../../../shared/domain/value-objects/unique-id.vo';
import { PaymentId } from '../../domain/value-objects/payment-id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { PaymentStatus } from '../../domain/value-objects/payment-status.vo';
import { eq } from 'drizzle-orm';

@Injectable()
export class DrizzlePaymentRepository implements PaymentRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async save(payment: Payment): Promise<void> {
    const row = DrizzlePaymentRepository.toPersistence(payment);

    await this.db
      .insert(payments)
      .values(row)
      .onConflictDoUpdate({
        target: payments.id,
        set: {
          gatewayTransactionId: row.gatewayTransactionId,
          status: row.status,
          amount: row.amount,
          currency: row.currency,
          updatedAt: row.updatedAt,
        },
      });
  }

  async findByOrderId(orderId: UniqueId): Promise<Payment | null> {
    const row = await this.db.query.payments.findFirst({
      where: eq(payments.orderId, orderId.getValue()),
    });

    if (!row) return null;

    return DrizzlePaymentRepository.toDomain(row);
  }

  private static toDomain(row: typeof payments.$inferSelect): Payment {
    return Payment.reconstitute({
      id: new PaymentId(row.id),
      orderId: row.orderId,
      amount: Money.create(row.amount / 100, row.currency),
      status: PaymentStatus.fromString(row.status),
      gatewayTransactionId: row.gatewayTransactionId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private static toPersistence(payment: Payment): typeof payments.$inferSelect {
    return {
      id: payment.id.getValue(),
      orderId: payment.orderId,
      amount: payment.amount.toCents(),
      currency: payment.amount.getCurrency(),
      status: payment.status.getValue(),
      gatewayTransactionId: payment.gatewayTransactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
