import { integer, pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { user } from './user.schema';
import { slot } from './slot.schema';
import { APPOINTMENT_STATUS } from '../../constants/enums';
import { timestamps } from '../helpers/column.helper';

export const appointmentStatusEnum = pgEnum('appointment_status', [
    APPOINTMENT_STATUS.SCHEUDLED,
    APPOINTMENT_STATUS.CANCELLED,
    APPOINTMENT_STATUS.COMPLETED,
]);

export const appointment = pgTable('appointment', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    professorId: integer('professor_id')
        .notNull()
        .references(() => user.id),
    studentId: integer('student_id')
        .notNull()
        .references(() => user.id),
    slotId: integer('slot_id')
        .notNull()
        .references(() => slot.id),
    status: appointmentStatusEnum().notNull().default(APPOINTMENT_STATUS.SCHEUDLED),
    ...timestamps,
});
