import { Schema, model } from 'mongoose';
import { APPOINTMENT_STATUS } from '../constants/enums';
import { IAppointmentDocument, IAppointmentModel } from '../interfaces/models/appointment.model.interface';

const appointmentSchema = new Schema<IAppointmentDocument, IAppointmentModel>(
    {
        professor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        slot: {
            type: Schema.Types.ObjectId,
            ref: 'Slot',
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(APPOINTMENT_STATUS),
            default: APPOINTMENT_STATUS.SCHEUDLED,
        },
        cancelledBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    },
);

export const Appointment = model<IAppointmentDocument, IAppointmentModel>('Appointment', appointmentSchema);
