import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import logger from '../config/logger.config';
import { ZodError } from 'zod';
import env from '../config';
import { ApiResponse } from '../utils/ApiResponse';

function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
    logger.error('Error Middleware:', {
        message: err.message,
        stack: err.stack,
        errors: err.errors,
        path: req.path,
        method: req.method,
    });

    const isDev = env.NODE_ENV === 'development';

    // if (isDev) {
    //     console.log(err);
    // }

    if (err instanceof AppError) {
        res.status(err.statusCode).json(ApiResponse(err.statusCode, err.message, isDev ? err.errors : null));
    }

    if (err instanceof ZodError) {
        const errorMessages = err.errors.map((issue: any) => `${issue.path.join('.')} is ${issue.message}`);
        res.status(400).json(ApiResponse(400, 'Validation error', errorMessages));
    }

    res.status(500).json(ApiResponse(500, 'Something went wrong', isDev ? err.stack : null));

    return;
}

// BUG Fix: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

export default errorHandler;
