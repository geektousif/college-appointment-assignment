import express from 'express';
import { createUserRouter } from './user.route';
import { createSlotRouter } from './slot.route';
import { createAppointmentRouter } from './appointment.route';

export const setupRoutes = () => {
    const router = express.Router();

    router.use('/user', createUserRouter());
    router.use('/slots', createSlotRouter());
    router.use('/appointments', createAppointmentRouter());

    return router;
};
