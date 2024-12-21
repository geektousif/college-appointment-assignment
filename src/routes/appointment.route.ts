import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import { USER_ROLE } from '../constants/enums';
import { UserRole } from '../types';

const router = Router();

router.use(authMiddleware);

router.post('/', roleMiddleware([USER_ROLE.STUDENT] as UserRole[]), appointmentController.createAppointment);
router.delete(
    '/:appointmentId',
    roleMiddleware([USER_ROLE.STUDENT, USER_ROLE.PROFESSOR] as UserRole[]),
    appointmentController.cancelAppointment,
);

router.get('/student', roleMiddleware([USER_ROLE.STUDENT] as UserRole[]), appointmentController.getStudentAppointments);
router.get(
    '/professor',
    roleMiddleware([USER_ROLE.PROFESSOR] as UserRole[]),
    appointmentController.getProfessorAppointments,
);

export default router;
