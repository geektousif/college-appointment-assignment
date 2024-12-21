import jwt from 'jsonwebtoken';
import env from '../config';
import { cookieOptions } from './miscHelpers';
import { JWTRefreshTokenPayload, JWTTokenPayload } from '../types';

export const generateAccessToken = (payload: JWTTokenPayload) => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: '3h',
    });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

export const generateRefreshToken = (payload: JWTRefreshTokenPayload) => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

export const accessTokenCookieOptions = {
    ...cookieOptions,
    maxAge: 3 * 60 * 60 * 1000, // 3 hours
};

export const refreshTokenCookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
