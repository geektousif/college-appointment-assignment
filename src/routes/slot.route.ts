import { Router } from 'express';
import { SlotController } from '../controllers/slot.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { USER_ROLE } from '../constants/enums';
import validate from '../middlewares/validateSchema.middleware';
import { container } from 'tsyringe';
import { createSlotSchema } from '../validators/slot.validator';
import { DI_TOKEN_NAMES } from '../constants/container';

export const createSlotRouter = () => {
    const router = Router();

    const controller = container.resolve<SlotController>(DI_TOKEN_NAMES.SLOT_CONTROLLER);

    const { PROFESSOR, STUDENT } = USER_ROLE;
    const { createSlot, getMySlots, searchSlots, deleteSlot } = controller;

    router.post('/', authMiddleware([PROFESSOR]), validate(createSlotSchema), createSlot);
    router.get('/:professorId', authMiddleware([STUDENT, PROFESSOR]), searchSlots);
    router.get('/', authMiddleware([PROFESSOR]), getMySlots);

    router.delete('/:slotId', authMiddleware([PROFESSOR]), deleteSlot);

    return router;
};
