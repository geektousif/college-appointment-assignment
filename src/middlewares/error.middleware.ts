import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import AppError from '../utils/AppError';
import logger from '../config/logger.config';
import env from '../config';
import { ErrorResponse } from '../utils/ApiResponse';

// @ts-ignore
function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    logger.error('Error: ', err); // TODO logger not perfect
    console.log(err);

    const isDev = env.NODE_ENV === 'development';
    const errStack = isDev ? err.errors : undefined;

    if (err instanceof AppError) {
        res.status(err.statusCode).json(ErrorResponse(err.statusCode, err.message, errStack));
    }

    if (err instanceof ZodError) {
        const errorMessages = err.errors.map((issue: any) => `${issue.path.join('.')} is ${issue.message}`);

        res.status(400).json(ErrorResponse(400, 'Bad Request', errorMessages));
    }

    res.status(500).json(ErrorResponse(500, 'Internal Server Error', errStack));

    return;
}

// BUG Maybe a bug from here: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

export default errorHandler;
