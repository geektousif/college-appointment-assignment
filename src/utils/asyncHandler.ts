import { NextFunction, Response } from 'express';
import { RequestUser } from '../types';

type AsyncFunction = (req: RequestUser, res: Response, next: NextFunction) => Promise<any>;

const asyncHandler = (fn: AsyncFunction) => (req: RequestUser, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
