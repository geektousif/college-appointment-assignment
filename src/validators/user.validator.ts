import { z } from 'zod';
import { USER_ROLE } from '../constants/enums';

export const createUserSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.nativeEnum(USER_ROLE).default(USER_ROLE.STUDENT),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const loginUserSchema = createUserSchema.pick({ email: true, password: true });

export type LoginUserSchema = z.infer<typeof loginUserSchema>;

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
