import { z } from 'zod';

const createAppointmentSchema = z.object({
    slotId: z.number(),
});

export { createAppointmentSchema };

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
