import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { USER_ROLE } from '../constants/enums';
import { container } from 'tsyringe';
import { DI_TOKEN_NAMES } from '../constants/container';
import validate from '../middlewares/validateSchema.middleware';
import { cancelAppointmentSchema, createAppointmentSchema } from '../validators/appointment.validator';

export const createAppointmentRouter = () => {
    const router = Router();

    const controller = container.resolve<AppointmentController>(DI_TOKEN_NAMES.APPOINTMENT_CONTROLLER);

    const { createAppointment, cancelAppointment, getMyAppointments } = controller;
    const { STUDENT, PROFESSOR } = USER_ROLE;

    router.post('/book', authMiddleware([STUDENT]), validate(createAppointmentSchema), createAppointment);
    router.post(
        '/cancel/:appointmentId',
        authMiddleware([STUDENT, PROFESSOR]),
        validate(cancelAppointmentSchema),
        cancelAppointment,
    );
    router.get('/', authMiddleware([STUDENT, PROFESSOR]), getMyAppointments);

    return router;
};
