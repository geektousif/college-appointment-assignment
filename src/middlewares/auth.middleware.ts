import { Request, Response, NextFunction } from 'express';

import { verifyAccessToken } from '../utils/jwtHelpers';
import { UnauthorizedError } from '../utils/AppError';

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const token =
        req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);

    if (!token) {
        throw new UnauthorizedError('Access Token not provided');
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        throw new UnauthorizedError('Invalid Access Token');
    }
};

export default authMiddleware;
