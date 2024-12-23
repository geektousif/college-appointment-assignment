import { verifyAccessToken } from '../utils/jwtHelpers';
import { UnauthorizedError } from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';
import { JWTTokenPayload } from '../types';

const authMiddleware = asyncHandler(async (req, _res, next) => {
    const token =
        req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);

    if (!token) {
        throw new UnauthorizedError('Access Token not provided');
    }

    try {
        const decoded = verifyAccessToken(token);
        // TODO add user to req object
        req.user = decoded as JWTTokenPayload;
        next();
    } catch (error) {
        console.log(error);
        throw new UnauthorizedError('Invalid Access Token');
    }
});

export default authMiddleware;
