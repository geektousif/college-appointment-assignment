import { CreateAppointmentSchema, UpdateAppointmentSchema } from '../validators/appointment.validator';
import { SlotResponseDto } from './slot.dto';
import { UserResponseDto } from './user.dto';

export interface CreateAppointmentDto extends CreateAppointmentSchema {
    professor?: string;
    student: string;
}

export interface UpdateAppointmentDto extends UpdateAppointmentSchema {
    slot: string;
    student: string;
    professor: string;
}

export interface CancelAppointmentDto {
    appointmentId: string;
    userId: string;
}

export interface AppointmentResponseDto {
    id: string;
    professor: UserResponseDto;
    student: UserResponseDto;
    slot: SlotResponseDto;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
