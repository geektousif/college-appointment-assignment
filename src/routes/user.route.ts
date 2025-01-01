import express from 'express';
import { container } from 'tsyringe';

import { UserController } from '../controllers/user.controller';
import validate from '../middlewares/validateSchema.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import { USER_ROLE } from '../constants/enums';
import { createUserSchema, loginUserSchema } from '../validators/user.validator';
import { DI_TOKEN_NAMES } from '../constants/container';

export const createUserRouter = () => {
    const router = express.Router();

    const controller = container.resolve<UserController>(DI_TOKEN_NAMES.USER_CONTROLLER);

    const { register, login, logout, getMe, refreshToken } = controller;
    const { STUDENT, PROFESSOR } = USER_ROLE;

    router.post('/register', validate(createUserSchema), register);
    router.post('/login', validate(loginUserSchema), login);
    router.get('/logout', authMiddleware([STUDENT, PROFESSOR]), logout);

    router.post('/refresh-token', authMiddleware([STUDENT, PROFESSOR]), refreshToken);
    router.get('/', authMiddleware([STUDENT, PROFESSOR]), getMe);

    return router;
};
