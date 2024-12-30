import { COOKIE_EXPIRATION } from '../constants';
import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
};

export const accessCookieOptions = {
    ...cookieOptions,
    maxAge: COOKIE_EXPIRATION.ACCESS_TOKEN,
};

export const refreshCookieOptions = {
    ...cookieOptions,
    maxAge: COOKIE_EXPIRATION.REFRESH_TOKEN,
};
