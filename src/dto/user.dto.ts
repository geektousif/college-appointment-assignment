import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { user } from '../db/schemas/user.schema';
import { z } from 'zod';
import { USER_ROLE } from '../constants/enums';

export const selectUserSchema = createSelectSchema(user).omit({
    password: true,
});

export const createUserSchema = createInsertSchema(user, {
    name: (schema) => schema.min(1),
    email: (schema) => schema.email().min(1),
    password: (schema) => schema.min(3),
    role: z.enum([USER_ROLE.STUDENT, USER_ROLE.PROFESSOR]).default(USER_ROLE.STUDENT),
});

export const loginUserSchema = z.object({
    email: z.string().email().min(1),
    password: z.string().min(3),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type SelectUserSchema = z.infer<typeof selectUserSchema>;
