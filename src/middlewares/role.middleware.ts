import { UnauthorizedError } from '../utils/AppError';
import logger from '../config/logger.config';
import { UserRole } from '../types';
import asyncHandler from '../utils/asyncHandler';

const roleMiddleware = (allowedRoles: UserRole[]) =>
    asyncHandler(async (req, _res, next) => {
        if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
            throw new UnauthorizedError('Not authorized to access this route');
        }

        logger.info(
            `Access granted for user ${req.user.id} with role ${req.user.role} to access the route ${req.originalUrl}`,
        );
        next();
    });

export default roleMiddleware;
