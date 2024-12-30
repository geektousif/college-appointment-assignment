import jwt from 'jsonwebtoken';
import envConfig from '../config';
import { AuthUser } from '../interfaces/auth.user.interface';
import { JWT_EXPIRATION } from '../constants';

export const generateAccessToken = (payload: AuthUser) => {
    return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET, {
        expiresIn: JWT_EXPIRATION.ACCESS_TOKEN,
    });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, envConfig.JWT_ACCESS_SECRET);
};

export const generateRefreshToken = (payload: Partial<AuthUser>) => {
    return jwt.sign(payload, envConfig.JWT_REFRESH_SECRET, {
        expiresIn: JWT_EXPIRATION.REFRESH_TOKEN,
    });
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, envConfig.JWT_REFRESH_SECRET);
};
