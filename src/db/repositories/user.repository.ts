import { eq } from 'drizzle-orm';
import db from '..';
import { user } from '../schemas/user.schema';
import { CreateUserSchema } from '../../dto/user.dto';

const getUserByEmail = async (email: string) => {
    const [result] = await db.selectDistinct().from(user).where(eq(user.email, email));
    return result;
};

const getUserById = async (id: number) => {
    const [result] = await db.selectDistinct().from(user).where(eq(user.id, id));
    return result;
};

const createUser = async (newUser: CreateUserSchema) => {
    const [result] = await db.insert(user).values(newUser).returning();
    return result;
};

const updateUserRefreshToken = async (userId: number, refreshToken: string | null) => {
    return await db.update(user).set({ refreshToken }).where(eq(user.id, userId));
};

export const userRepository = { getUserByEmail, createUser, updateUserRefreshToken, getUserById };
