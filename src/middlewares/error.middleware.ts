import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import logger from '../config/logger.config';
import { ZodError } from 'zod';
import env from '../config';
import { ApiResponse } from '../utils/ApiResponse';

function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    const isDev = env.NODE_ENV === 'development';

    if (err instanceof AppError) {
        res.status(err.statusCode).json(ApiResponse(err.statusCode, err.message, isDev ? err.errors : null));
    }

    if (err instanceof ZodError) {
        const errorMessages = err.errors.map((issue: any) => `${issue.path.join('.')} is ${issue.message}`);
        res.status(400).json(ApiResponse(400, 'Validation error', errorMessages));
    }

    logger.error(err);

    res.status(500).json(ApiResponse(500, 'Something went wrong', isDev ? err.stack : null));
}

export default errorHandler;
