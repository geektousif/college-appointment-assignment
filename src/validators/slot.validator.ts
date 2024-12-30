import { z } from 'zod';

// TODO : Add validation for user checking

const slotSchema = z.object({
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
});

export const createSlotSchema = slotSchema
    .extend({
        startTime: z.coerce
            .date()
            .refine((value) => new Date(value) > new Date(), { message: "Start time can't be in the past" }),
        endTime: z.coerce
            .date()
            .refine((value) => new Date(value) > new Date(), { message: "End time can't be in the past" }),
    })
    .refine((data) => data.startTime < data.endTime, { message: 'End time should be greater than start time' });

export const updateSlotSchema = slotSchema
    .extend({
        isBooked: z.boolean().optional(),
        startTime: z.coerce
            .date()
            .refine((value) => new Date(value) > new Date(), { message: "Start time can't be in the past" })
            .optional(),
        endTime: z.coerce
            .date()
            .refine((value) => new Date(value) > new Date(), { message: "End time can't be in the past" })
            .optional(),
    })
    .refine((data) => data.startTime && data.endTime && data.startTime < data.endTime, {
        message: 'End time should be greater than start time',
    });

export const checkSlotAvailabilitySchema = z.object({
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
});

export type CheckSlotAvailabilitySchema = z.infer<typeof checkSlotAvailabilitySchema>;

export type CreateSlotSchema = z.infer<typeof createSlotSchema>;
export type UpdateSlotSchema = z.infer<typeof updateSlotSchema>;
