import { z } from 'zod';
import { APPOINTMENT_STATUS } from '../constants/enums';

export const createAppointmentSchema = z.object({
    slot: z.string().min(1, 'Please select a slot'),
});

export const cancelAppointmentSchema = z.object({
    status: z.nativeEnum(APPOINTMENT_STATUS),
});

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
export type CancelAppointmentSchema = z.infer<typeof cancelAppointmentSchema>;
