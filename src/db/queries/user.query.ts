import { eq } from 'drizzle-orm';
import db from '..';
import { user } from '../schemas/user.schema';
import { NewUser } from '../../dto/user.dto';

export const getUserByEmail = async (email: string) => {
    const [result] = await db.selectDistinct().from(user).where(eq(user.email, email));
    return result;
};

export const createUser = async (newUser: NewUser) => {
    const [result] = await db.insert(user).values(newUser).returning();

    return result;
};
