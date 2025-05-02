import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// App settings table for storing configuration like author key
export const appSettings = pgTable('app_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}); 