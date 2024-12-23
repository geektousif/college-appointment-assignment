import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { slot } from '../db/schemas/slot.schema';
import { z } from 'zod';

// TODO Separate Validation Schemas and DTOs
// TODO Fix mess with professorId

export const createSlotSchema = createInsertSchema(slot, {
    professorId: z.number().positive().optional(),
    startTime: z.coerce
        .date()
        .refine((value) => new Date(value) > new Date(), { message: "Start time can't be in the past" }),
    endTime: z.coerce
        .date()
        .refine((value) => new Date(value) > new Date(), { message: "End time can't be in the past" }),
}).refine((data) => data.startTime < data.endTime, { message: 'End time should be greater than start time' });

export const selectSlotSchema = createSelectSchema(slot);

export const updateSlotSchema = createUpdateSchema(slot).pick({ startTime: true, endTime: true, isBooked: true });

export type CreateSlotSchema = z.infer<typeof createSlotSchema>;
export type SelectSlotSchema = z.infer<typeof selectSlotSchema>;
export type UpdateSlotSchema = z.infer<typeof updateSlotSchema>;
