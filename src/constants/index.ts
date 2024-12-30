import ms from 'ms';

export const JWT_EXPIRATION = {
    ACCESS_TOKEN: '30m',
    REFRESH_TOKEN: '1d',
} as const;

export const COOKIE_EXPIRATION = {
    ACCESS_TOKEN: ms(JWT_EXPIRATION.ACCESS_TOKEN),
    REFRESH_TOKEN: ms(JWT_EXPIRATION.REFRESH_TOKEN),
} as const;

export const COOKIE_NAMES = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
} as const;
