import express from 'express';
import authRouter from './auth.route';
import slotRouter from './slot.route';
import appointmentRouter from './appointment.route';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/slots', slotRouter);
router.use('/appointments', appointmentRouter);

export default router;
