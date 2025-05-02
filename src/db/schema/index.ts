import { pgTable, uuid, decimal, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category').notNull(),
  description: text('description'),
  date: timestamp('date').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  icon: varchar('icon').notNull(),
  color: varchar('color').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  period: varchar('period').notNull(), // 'monthly' | 'yearly'
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export * from './bill';
export * from './appSettings'; 