import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { orders } from './orders.schema';
import { varchar } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'succeeded',
]);

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id),
  gatewayTransactionId: varchar('gateway_transaction_id'),
  status: paymentStatusEnum('status').notNull().default('pending'),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
