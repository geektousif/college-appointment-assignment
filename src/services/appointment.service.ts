import mongoose from 'mongoose';

import { AppointmentRepository } from '../repositories/appointment.repository';
import { SlotRepository } from '../repositories/slot.repository';
import { CreateAppointmentDto } from '../dto/appointment.dto';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/AppError';
import logger from '../config/logger.config';
import { inject, injectable } from 'tsyringe';
import { DI_TOKEN_NAMES } from '../constants/container';

@injectable()
export class AppointmentService {
    private connection: mongoose.Connection;
    constructor(
        @inject(DI_TOKEN_NAMES.APPOINTMENT_REPOSITORY) private appointmentRepository: AppointmentRepository,
        @inject(DI_TOKEN_NAMES.SLOT_REPOSITORY) private slotRepository: SlotRepository,
    ) {
        this.connection = mongoose.connection;
    }

    async createAppointment(createData: CreateAppointmentDto) {
        const { slot: slotId, student: studentId } = createData;

        const slot = await this.slotRepository.findSlotById(slotId);

        if (!slot) {
            throw new BadRequestError('Slot not found');
        }

        if (slot.isBooked) {
            throw new BadRequestError('Slot is already booked');
        }

        const session = await this.connection.startSession();
        try {
            session.startTransaction();
            const appointment = await this.appointmentRepository.createAppointment(
                {
                    slot: slotId,
                    student: studentId,
                    professor: slot.professor.toString(),
                },
                session,
            );

            await this.slotRepository.updateSlot(slotId, { isBooked: true }, session);
            await session.commitTransaction();

            // LATER concurrency control
            // logger.info(`Appointment with id ${appointment.} created successfully`);
            return appointment; // TODO return AppointmentResponseDto
        } catch (error) {
            logger.error('Error creating appointment, rolling back: ', error);
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async cancelAppointment(appointmentId: string, userId: string) {
        const appointment = await this.appointmentRepository.findAppointmentById(appointmentId);

        if (!appointment) {
            throw new NotFoundError('Appointment not found');
        }

        if (appointment.student.toString() !== userId && appointment.professor.toString() !== userId) {
            throw new UnauthorizedError('Not Authorized to cancel this appointment');
        }

        const session = await this.connection.startSession();

        try {
            session.startTransaction();
            await this.slotRepository.updateSlot(appointment.slot.toString(), { isBooked: false }, session);
            await this.appointmentRepository.cancelAppointment({ appointmentId, userId }, session);
            await session.commitTransaction();

            logger.info(`Appointment with id ${appointmentId} cancelled successfully by user with id ${userId}`);
            return true;
        } catch (error) {
            logger.error('Error cancelling appointment', error);
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async getMyAppointments(userId: string) {
        return await this.appointmentRepository.findAppointmentsByUserId(userId);
    } // TODO return AppointmentResponseDto
}
