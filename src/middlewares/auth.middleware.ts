import { Request, Response, NextFunction } from 'express';

import { verifyAccessToken } from '../utils/jwtHelpers';
import { UnauthorizedError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';

const authMiddleware = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const token =
        req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);

    if (!token) {
        throw new UnauthorizedError('Access Token not provided');
    }

    try {
        const decoded = verifyAccessToken(token);
        // TODO add user to req object
        // @ts-ignore
        req.user = decoded;
        next();
    } catch (error) {
        throw new UnauthorizedError('Invalid Access Token');
    }
});

export default authMiddleware;
