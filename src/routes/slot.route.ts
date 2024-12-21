import { Router } from 'express';
import { slotController } from '../controllers/slot.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import { UserRole } from '../types';
import { USER_ROLE } from '../constants/enums';
import validate from '../middlewares/validateSchema.middleware';
import { createSlotSchema } from '../dto/slot.dto';

const router = Router();

router.use(authMiddleware);

router.get('/my', roleMiddleware([USER_ROLE.PROFESSOR] as UserRole[]), slotController.getMySlots);
router.get('/professor/:professorId', slotController.getSlotsByProfessor);

router.post(
    '/',
    roleMiddleware([USER_ROLE.PROFESSOR] as UserRole[]),
    validate(createSlotSchema),
    slotController.createSlot,
);

router.delete('/:slotId', roleMiddleware([USER_ROLE.PROFESSOR] as UserRole[]), slotController.deleteSlot);

export default router;
