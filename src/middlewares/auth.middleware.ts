import { verifyAccessToken } from '../utils/jwtHelpers';
import { ForbiddenError, UnauthorizedError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';
import { USER_ROLE } from '../constants/enums';
import { AuthUser } from '../interfaces/utils/auth.user.interface';
// import logger from '../config/logger.config';

const authMiddleware = (allowedRoles?: USER_ROLE[]) =>
    asyncHandler(async (req, _res, next) => {
        const token =
            req.cookies?.accessToken ||
            (req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1]);

        if (!token) {
            throw new UnauthorizedError('Access Token not provided');
        }

        // LATER implement node-cache

        const decoded = verifyAccessToken(token) as AuthUser;

        if (!decoded || !decoded.id || !decoded.role) {
            throw new UnauthorizedError('Invalid access token');
        }

        if (allowedRoles && !allowedRoles.includes(decoded.role)) {
            throw new ForbiddenError('You are not authorized to access this route');
        }

        req.user = decoded;

        next();
    });

export default authMiddleware;
