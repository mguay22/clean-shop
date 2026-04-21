import { pgTable, unique, uuid, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const products = pgTable("products", {
	id: uuid().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	sku: varchar({ length: 100 }).notNull(),
	priceAmount: integer("price_amount").notNull(),
	priceCurrency: varchar("price_currency", { length: 3 }).default('USD').notNull(),
	stock: integer().default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	lowStockThreshold: integer("low_stock_threshold").default(5).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("products_sku_unique").on(table.sku),
]);

export const customers = pgTable("customers", {
	id: uuid().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	lastName: varchar("last_name", { length: 100 }).notNull(),
	phone: varchar({ length: 20 }),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("customers_email_unique").on(table.email),
]);
