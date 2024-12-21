import { integer, pgTable, boolean, timestamp } from 'drizzle-orm/pg-core';
import { timestamps } from '../helpers/column.helper';
import { user } from './user.schema';

export const slot = pgTable('slot', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    professorId: integer('professor_id')
        .notNull()
        .references(() => user.id),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    isBooked: boolean('is_booked').notNull().default(false),
    ...timestamps,
});
