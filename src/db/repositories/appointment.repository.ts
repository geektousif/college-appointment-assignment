import { eq, or, and } from 'drizzle-orm';
import db from '..';
import { slot } from '../schemas/slot.schema';
import { appointment } from '../schemas/appointment.schema';
import { APPOINTMENT_STATUS } from '../../constants/enums';
import { user } from '../schemas/user.schema';

const createAppointment = async (studentId: number, slotId: number) => {
    const [result] = await db.transaction(async (tx) => {
        const [res] = await tx
            .update(slot)
            .set({ isBooked: true })
            .where(eq(slot.id, slotId))
            .returning({ professorId: slot.professorId });

        return await tx
            .insert(appointment)
            .values({
                studentId,
                professorId: res.professorId,
                slotId,
            })
            .returning();
    });

    return result;
};

const getAppointmentById = async (appointmentId: number) => {
    const [result] = await db.selectDistinct().from(appointment).where(eq(appointment.id, appointmentId));

    return result;
};

const deleteAppointment = async (appointmentId: number) => {
    return await db.transaction(async (tx) => {
        await tx
            .update(appointment)
            .set({ status: APPOINTMENT_STATUS.CANCELLED })
            .where(eq(appointment.id, appointmentId));

        return await tx.update(slot).set({ isBooked: false }).from(appointment).where(eq(slot.id, appointment.slotId));
    });
};

const getMyAppointments = async (userId: number) => {
    return await db
        .select({
            id: appointment.id,
            slotId: appointment.slotId,
            startTime: slot.startTime,
            endTime: slot.endTime,
            professorId: appointment.professorId,
            professorName: user.name,
            professorEmail: user.email,
            studentId: appointment.studentId,
            studentName: user.name,
            studentEmail: user.email,
        })
        .from(appointment)
        .where(
            and(
                or(eq(appointment.studentId, userId), eq(appointment.professorId, userId)),
                eq(appointment.status, APPOINTMENT_STATUS.SCHEUDLED),
            ),
        )
        .innerJoin(slot, eq(appointment.slotId, slot.id))
        .innerJoin(user, eq(appointment.professorId, user.id));
};

export const appointmentRepository = {
    createAppointment,
    deleteAppointment,
    getAppointmentById,
    getMyAppointments,
};
