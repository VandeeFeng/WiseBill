import { pgTable, uuid, numeric, timestamp, text } from 'drizzle-orm/pg-core';

// Bill table for storing transactions
export const bill = pgTable('bill', {
  id: uuid('id').primaryKey().defaultRandom(),
  bankName: text('银行名称').notNull(),
  amount: numeric('消费金额', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('消费时间').defaultNow().notNull(),
  purpose: text('消费用途'),
  createdAt: timestamp('created_at').defaultNow(),
}); 