import logger from '../config/logger.config';
import { slotRepository } from '../db/repositories/slot.repository';
import { userRepository } from '../db/repositories/user.repository';
import { CreateSlotSchema } from '../dto/slot.dto';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/AppError';

const createSlot = async (availabilityData: CreateSlotSchema) => {
    const { endTime, professorId, startTime } = availabilityData;

    // FIX mess around professorId from DTO schema
    const isSlotAvailable = await slotRepository.checkSlotAvailability(professorId!, startTime, endTime);

    if (!isSlotAvailable) {
        throw new BadRequestError('Time Slot is already allocated');
    }

    const newSlot = await slotRepository.createSlot({ professorId, startTime, endTime });

    logger.info(`Slot created successfully with id: ${newSlot.id} for professorId: ${professorId}`);
    return newSlot;
};

// TODO : Search Slots based on Date
const getSlotsByProfessor = async (professorId: number) => {
    // TODO check if professor exists
    const user = await userRepository.getUserById(professorId);

    if (!user || user.role !== 'professor') {
        throw new NotFoundError('Invalid Professor Id');
    }

    // TODO check if professor has slots , if not return empty array
    const slots = await slotRepository.getSlots(professorId);

    if (!slots.length) {
        return [];
    }

    return slots;
};

const getAvailableSlots = async (professorId: number) => {
    const user = await userRepository.getUserById(professorId);

    if (!user || user.role !== 'professor') {
        throw new NotFoundError('Invalid Professor Id');
    }

    // TODO check if professor has slots , if not return empty array
    const slots = await slotRepository.getAvailableSlots(professorId);

    if (!slots.length) {
        return [];
    }

    return slots;
};

const deleteSlot = async (slotId: number, professorId: number) => {
    const slot = await slotRepository.getSlotDetailsById(slotId);

    if (!slot) {
        throw new NotFoundError('Slot not found');
    }

    if (slot.professorId !== professorId) {
        throw new UnauthorizedError('Not authorized to delete this slot');
    }

    await slotRepository.deleteSlot(slotId);

    return logger.info(`Slot deleted successfully with id: ${slotId}`);
};

// TODO : Update Slot

export const slotService = { createSlot, getAvailableSlots, getSlotsByProfessor, deleteSlot };

// TODO disalocate slot after time is passed (cron job)
