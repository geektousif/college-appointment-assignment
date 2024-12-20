import express from 'express';
import authController from '../controllers/auth.controller';
import validate from '../middlewares/validateSchema.middleware';
import { newUserSchema } from '../dto/user.dto';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', validate(newUserSchema), authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/me', authMiddleware, authController.me);

export default router;
