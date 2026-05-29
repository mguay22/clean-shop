import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { customers } from './customers.schema';
import { pgEnum } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { varchar } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { products } from './products.schema';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
]);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id),
  status: orderStatusEnum('status').notNull().default('pending'),
  totalAmount: integer('total_amount').notNull(),
  totalCurrency: varchar('total_currency', { length: 3 })
    .notNull()
    .default('USD'),
  shippingStreet: varchar('shipping_street'),
  shippingCity: varchar('shipping_city'),
  shippingState: varchar('shipping_state'),
  shippingZipCode: varchar('shipping_zip_code'),
  shippingCountry: varchar('shipping_country'),
  trackingNumber: varchar('tracking_number'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  productName: varchar('product_name').notNull(),
  unitPriceAmount: integer('unit_price_amount').notNull(),
  unitPriceCurrency: varchar('unit_price_currency', { length: 3 })
    .notNull()
    .default('USD'),
  quantity: integer('quantity').notNull(),
  discountAmount: integer('discount_amount'),
  discountCurrency: varchar('discount_currency', { length: 3 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
