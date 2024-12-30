import { APPOINTMENT_STATUS } from '../constants/enums';
import { IAppointmentModel } from '../interfaces/models/appointment.model.interface';
import { CancelAppointmentDto, CreateAppointmentDto } from '../dto/appointment.dto';
import { ClientSession } from 'mongoose';
import { injectable, inject } from 'tsyringe';
import { DI_TOKEN_NAMES } from '../constants/container';

@injectable()
export class AppointmentRepository {
    constructor(@inject(DI_TOKEN_NAMES.APPOINTMENT_MODEL) private appointmentModel: IAppointmentModel) {}

    async createAppointment(appointmentData: CreateAppointmentDto, session?: ClientSession) {
        return await this.appointmentModel.create(
            [
                {
                    slot: appointmentData.slot,
                    student: appointmentData.student,
                    professor: appointmentData.professor,
                },
            ],
            { session },
        );
    }

    async findAppointmentById(appointmentId: string) {
        return await this.appointmentModel.findById(appointmentId);
    }

    async findAppointmentsBySlotId(slotId: string) {
        return await this.appointmentModel.findOne({ slot: slotId });
    }

    async cancelAppointment(cancelData: CancelAppointmentDto, session?: ClientSession) {
        return await this.appointmentModel.findByIdAndUpdate(
            cancelData.appointmentId,
            { status: APPOINTMENT_STATUS.CANCELLED, cancelledBy: cancelData.userId },
            { session },
        );
    }

    async findAppointmentsByUserId(userId: string) {
        return await this.appointmentModel.find({
            status: APPOINTMENT_STATUS.SCHEUDLED,
            $or: [{ student: userId }, { professor: userId }],
        });
    }
}

// TODO
// == Appointment with Details ==
//     return await db
//         .select({
//             id: appointment.id,
//             slotId: appointment.slotId,
//             startTime: slot.startTime,
//             endTime: slot.endTime,
//             professorId: appointment.professorId,
//             professorName: user.name,
//             professorEmail: user.email,
//             studentId: appointment.studentId,
//             studentName: user.name,
//             studentEmail: user.email,
//         })
//         .from(appointment)
//         .where(
//             and(
//                 or(eq(appointment.studentId, userId), eq(appointment.professorId, userId)),
//                 eq(appointment.status, APPOINTMENT_STATUS.SCHEUDLED),
//             ),
//         )
//         .innerJoin(slot, eq(appointment.slotId, slot.id))
//         .innerJoin(user, eq(appointment.professorId, user.id));
