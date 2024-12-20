import { createUser, getUserByEmail } from '../db/queries/user.query';
import { NewUser } from '../dto/user.dto';
import { ConflictError, UnauthorizedError } from '../utils/AppError';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtHelpers';

const register = async (data: NewUser) => {
    const { email, password, role, name } = data;

    const userExists = await getUserByEmail(email);

    if (userExists) {
        throw new ConflictError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
        email,
        password: hashedPassword,
        role,
        name,
    });

    return newUser;
};

const login = async (email: string, password: string) => {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    return { accessToken, refreshToken };
};

export default { register, login };
