import { UserRepository } from '../repositories/user.repository';
import AppError, { ConflictError, UnauthorizedError } from '../utils/AppError';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwtHelpers';
import logger from '../config/logger.config';
import { CreateUserDto, LoginUserDto, UserResponseDto } from '../dto/user.dto';
import envConfig from '../config';
import { AuthUser } from '../interfaces/utils/auth.user.interface';
import { inject, injectable } from 'tsyringe';
import { DI_TOKEN_NAMES } from '../constants/container';

@injectable()
export class UserService {
    constructor(@inject(DI_TOKEN_NAMES.USER_REPOSITORY) private userRepository: UserRepository) {}

    async register(data: CreateUserDto): Promise<UserResponseDto> {
        try {
            const { email, password, role, name } = data;

            const existingUser = await this.userRepository.userExists({ email });

            if (existingUser) {
                throw new ConflictError('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, envConfig.PASSWORD_HASH_ROUNDS);

            const newUser = await this.userRepository.createUser({
                email,
                password: hashedPassword,
                role,
                name,
            });

            // TODO use mapper or properly handle ObjectID -> string
            return {
                id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Failed to register user');
        }
    }

    async login(data: LoginUserDto): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const { email, password } = data;

            const user = await this.userRepository.findUserByEmail(email, { password: true });

            if (!user) {
                throw new UnauthorizedError('Invalid credentials');
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                throw new UnauthorizedError('Invalid credentials');
            }

            const accessToken = generateAccessToken({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            });

            const refreshToken = generateRefreshToken({
                id: user._id.toString(),
            });

            await this.userRepository.updateUser(user.id, { refreshToken });

            return { accessToken, refreshToken };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Failed to login user');
        }
    }

    async logout(userId: string) {
        await this.userRepository.clearRefreshToken(userId);

        return true;
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const decoded = verifyRefreshToken(refreshToken) as Partial<AuthUser>;

            const user = await this.userRepository.findUserById(decoded?.id as string);

            if (!user || user.refreshToken !== refreshToken) {
                throw new UnauthorizedError('Invalid refresh token');
            }

            const accessToken = generateAccessToken({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            });

            logger.info(`Access token refreshed for user with id: ${user.id}`);
            return { accessToken };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Failed to refresh access token');
        }
    }

    async getUserById(userId: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findUserById(userId);

        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
