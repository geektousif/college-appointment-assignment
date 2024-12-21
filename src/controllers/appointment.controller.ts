import { appointmentService } from '../services/appointment.service';
import { ApiResponse } from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';

const createAppointment = asyncHandler(async (req, res) => {
    const { slotId } = req.body;

    const studentId = Number(req.user?.id);

    const appointment = await appointmentService.createAppointment(studentId, slotId);

    return res.status(201).json(ApiResponse(201, 'Appointment created successfully', appointment));
});

const cancelAppointment = asyncHandler(async (req, res) => {
    const appointmentId = Number(req.params.appointmentId);
    const userId = Number(req.user?.id);

    await appointmentService.cancelAppointment(appointmentId, userId);

    return res.status(200).json(ApiResponse(200, 'Appointment cancelled successfully', null));
});

const getStudentAppointments = asyncHandler(async (req, res) => {
    const studentId = Number(req.user?.id);

    const appointments = await appointmentService.getStudentAppointments(studentId);

    return res.status(200).json(ApiResponse(200, 'Appointments fetched successfully', appointments));
});

const getProfessorAppointments = asyncHandler(async (req, res) => {
    const professorId = Number(req.user?.id);

    const appointments = await appointmentService.getProfessorAppointments(professorId);

    return res.status(200).json(ApiResponse(200, 'Appointments fetched successfully', appointments));
});

export const appointmentController = {
    createAppointment,
    cancelAppointment,
    getStudentAppointments,
    getProfessorAppointments,
};
