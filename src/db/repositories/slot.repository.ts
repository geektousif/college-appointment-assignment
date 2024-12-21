import { and, between, eq, or } from 'drizzle-orm';
import db from '..';
import { slot } from '../schemas/slot.schema';
import { CreateSlotSchema } from '../../dto/slot.dto';

const checkSlotAvailability = async (professorId: number, startTime: Date, endTime: Date) => {
    console.log(professorId, startTime, endTime);
    const slotAvailability = await db
        .select()
        .from(slot)
        .where(
            and(
                eq(slot.professorId, professorId),
                or(between(slot.startTime, startTime, endTime), between(slot.endTime, startTime, endTime)),
            ),
        );
    return slotAvailability.length === 0;
};

const getSlots = async (professorId: number) => {
    return await db.select().from(slot).where(eq(slot.professorId, professorId));
};

const getSlotDetailsById = async (id: number) => {
    const [result] = await db.select().from(slot).where(eq(slot.id, id));
    return result;
};

const createSlot = async (data: CreateSlotSchema) => {
    const [result] = await db
        .insert(slot)
        .values({
            professorId: data.professorId!,
            startTime: data.startTime,
            endTime: data.endTime,
        })
        .returning();

    return result;
};

const deleteSlot = async (slotId: number) => await db.delete(slot).where(eq(slot.id, slotId));

export const slotRepository = {
    checkSlotAvailability,
    getSlots,
    getSlotDetailsById,
    createSlot,
    deleteSlot,
};
