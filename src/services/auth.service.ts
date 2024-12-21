import { userRepository } from '../db/repositories/user.repository';
import { CreateUserSchema } from '../dto/user.dto';
import { ConflictError, UnauthorizedError } from '../utils/AppError';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwtHelpers';
import logger from '../config/logger.config';
import { JWTRefreshTokenPayload, UserRole } from '../types';

const register = async (data: CreateUserSchema) => {
    const { email, password, role, name } = data;

    const userExists = await userRepository.getUserByEmail(email);

    if (userExists) {
        throw new ConflictError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.createUser({
        email,
        password: hashedPassword,
        role,
        name,
    });

    logger.info(`User created successfully with id: ${newUser.id}`);
    return newUser;
};

const login = async (email: string, password: string) => {
    const user = await userRepository.getUserByEmail(email);

    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role as UserRole });
    const refreshToken = generateRefreshToken({ id: user.id });

    await userRepository.updateUserRefreshToken(user.id, refreshToken);

    logger.info(`User logged in successfully with id: ${user.id}`);
    return { accessToken, refreshToken };
};

const logout = async (userId: number) => {
    await userRepository.updateUserRefreshToken(userId, null);
    logger.info(`User logged out successfully with id: ${userId}`);
};

const refreshAccessToken = async (refreshToken: string) => {
    const decoded = verifyRefreshToken(refreshToken) as JWTRefreshTokenPayload;

    const user = await userRepository.getUserById(decoded?.id);

    if (!user || user?.refreshToken !== refreshToken) {
        throw new UnauthorizedError('Invalid refresh token');
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role as UserRole });

    logger.info(`Access token refreshed for user with id: ${user.id}`);
    return { accessToken };
};

export const authService = { register, login, logout, refreshAccessToken };
