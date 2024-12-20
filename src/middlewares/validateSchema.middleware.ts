import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const validate = (schema: z.ZodSchema) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        req.body = await schema.parseAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};

export default validate;
