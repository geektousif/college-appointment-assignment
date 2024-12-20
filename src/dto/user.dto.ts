import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { user } from '../db/schemas/user.schema';
import { z } from 'zod';
import { USER_ROLE } from '../constants/enums';

export const userSelectSchema = createSelectSchema(user).omit({
    password: true,
});

export const newUserSchema = createInsertSchema(user, {
    name: (schema) => schema.min(1),
    email: (schema) => schema.email().min(1),
    password: (schema) => schema.min(3),
    role: z.enum([USER_ROLE.STUDENT, USER_ROLE.PROFESSOR]).default(USER_ROLE.STUDENT),
});

export type NewUser = z.infer<typeof newUserSchema>;

export type UserSelect = z.infer<typeof userSelectSchema>;
