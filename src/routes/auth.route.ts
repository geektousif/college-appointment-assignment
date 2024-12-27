import express from 'express';
import { authController } from '../controllers/auth.controller';
import validate from '../middlewares/validateSchema.middleware';
import { createUserSchema, loginUserSchema } from '../dto/user.dto';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', validate(createUserSchema), authController.register);
router.post('/login', validate(loginUserSchema), authController.login);
router.post('/logout', authMiddleware, authController.logout);

router.get('/me', authMiddleware, authController.getMe);

router.post('/refresh-token', authController.refreshToken);

export default router;
