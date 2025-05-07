import { pgTable, uuid, numeric, timestamp, text } from 'drizzle-orm/pg-core';

// Bill table for storing transactions
export const bill = pgTable('bill', {
  id: uuid('id').primaryKey().defaultRandom(),
  account: text('Account').notNull(),
  amount: numeric('Amount', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('Date').defaultNow().notNull(),
  description: text('Description'),
  createdAt: timestamp('created_at').defaultNow(),
}); 