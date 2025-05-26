import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const notebooks = pgTable(
  'notebooks',
  {
    id: serial('id').primaryKey().$type<number>(),
    userName: text('user_name').notNull(),
    brand: text('brand').notNull(),
    ram: text('ram').notNull(),
    processor: text('processor').notNull(),
    storageType: text('storage_type').notNull(),
    storageSize: text('storage_size').notNull(),
    phoneNumber: text('phone_number').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
  },
  (notebook) => {
    return {
      uniqueIdx: uniqueIndex('notebooks_unique_index').on(notebook.userName)
    };
  }
);

export type NewNotebook = InferInsertModel<typeof notebooks>;
export type Notebook = InferSelectModel<typeof notebooks>;
