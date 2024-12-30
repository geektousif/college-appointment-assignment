import { inject, injectable } from 'tsyringe';
import { CreateAppointmentDto } from '../dto/appointment.dto';
import { AppointmentService } from '../services/appointment.service';
import { SuccessResponse } from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import { DI_TOKEN_NAMES } from '../constants/container';
import { BadRequestError } from '../utils/AppError';

@injectable()
export class AppointmentController {
    constructor(@inject(DI_TOKEN_NAMES.APPOINTMENT_SERVICE) private appointmentService: AppointmentService) {}
    createAppointment = asyncHandler(async (req, res) => {
        const { slotId } = req.body;

        if (!slotId) {
            throw new BadRequestError('Slot ID is required');
        }

        const appointmentData: CreateAppointmentDto = {
            slot: slotId,
            student: req.user?.id as string,
        };

        console.log(appointmentData);
        const appointment = await this.appointmentService.createAppointment(appointmentData);

        return res.status(201).json(SuccessResponse(201, 'Appointment created successfully', appointment));
    });

    cancelAppointment = asyncHandler(async (req, res) => {
        const appointmentId = req.params.appointmentId as string;
        const userId = req.user?.id as string;

        await this.appointmentService.cancelAppointment(appointmentId, userId);

        return res.status(200).json(SuccessResponse(200, 'Appointment cancelled successfully', null));
    });

    getMyAppointments = asyncHandler(async (req, res) => {
        const userId = req.user?.id as string;

        const appointments = await this.appointmentService.getMyAppointments(userId);

        if (!appointments.length) {
            return res.status(200).json(SuccessResponse(200, 'No Appointments found', []));
        }
        return res.status(200).json(SuccessResponse(200, 'Your Appointments fetched successfully', appointments));
    });
}
