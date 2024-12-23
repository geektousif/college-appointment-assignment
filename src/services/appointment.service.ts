import { slotRepository } from '../db/repositories/slot.repository';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/AppError';
import { appointmentRepository } from '../db/repositories/appointment.repository';
import logger from '../config/logger.config';

const createAppointment = async (studentId: number, slotId: number) => {
    const slot = await slotRepository.getSlotDetailsById(slotId);

    if (!slot) {
        throw new NotFoundError('Slot not found');
    }

    if (slot.isBooked) {
        throw new BadRequestError('Slot already booked');
    }

    const appointment = await appointmentRepository.createAppointment(studentId, slotId);

    logger.info(`Appointment created for studentId: ${studentId} and slotId: ${slotId}`);
    return appointment;
};

const cancelAppointment = async (appointmentId: number, userId: number) => {
    const appointment = await appointmentRepository.getAppointmentById(appointmentId);

    if (!appointment) {
        throw new NotFoundError('Appointment not found');
    }

    if (appointment.studentId !== userId && appointment.professorId !== userId) {
        throw new UnauthorizedError('Not Authorized to cancel this appointment');
    }

    await appointmentRepository.deleteAppointment(appointmentId);

    return logger.info(`Appointment cancelled for appointmentId: ${appointmentId}`);
};

const getMyAppointments = async (userId: number) => {
    return await appointmentRepository.getMyAppointments(userId);
};

// const getStudentAppointments = async (studentId: number) => {
//     return await appointmentRepository.getStudentAppointments(studentId);
// };

// const getProfessorAppointments = async (professorId: number) => {
//     return await appointmentRepository.getProfessorAppointments(professorId);
// };

export const appointmentService = {
    createAppointment,
    cancelAppointment,
    getMyAppointments,
};
