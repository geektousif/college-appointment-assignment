import { SlotRepository } from '../repositories/slot.repository';

import { checkSlotAvailabilityDto, CreateSlotDto, SlotResponseDto, UpdateSlotDto } from '../dto/slot.dto';
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/AppError';
import { inject, injectable } from 'tsyringe';
import { DI_TOKEN_NAMES } from '../constants/container';

@injectable()
export class SlotService {
    constructor(@inject(DI_TOKEN_NAMES.SLOT_REPOSITORY) private slotRepository: SlotRepository) {}

    async createSlot(slotData: CreateSlotDto): Promise<SlotResponseDto> {
        const { endTime, professor, startTime } = slotData;

        const existingSlots = await this.slotRepository.findAvailableSlots({
            endTime,
            startTime,
            professor,
        });

        if (existingSlots && existingSlots.length) {
            throw new BadRequestError('Time Slot is already allocated');
        }

        const newSlot = await this.slotRepository.createSlot({
            endTime,
            professor,
            startTime,
        });

        return {
            id: newSlot._id.toString(),
            professor: newSlot.professor.toString(),
            startTime: newSlot.startTime,
            endTime: newSlot.endTime,
            isBooked: newSlot.isBooked,
            createdAt: newSlot.createdAt,
            updatedAt: newSlot.updatedAt,
        };
    }

    async searchSlots(data: checkSlotAvailabilityDto): Promise<SlotResponseDto[]> {
        const slots = await this.slotRepository.findAvailableSlots({
            professor: data.professor,
            startTime: data.startTime,
            endTime: data.endTime,
        });

        if (!slots.length) {
            return [];
        }

        return slots.map((slot) => ({
            id: slot._id.toString(),
            professor: slot.professor.toString(),
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: slot.isBooked,
            createdAt: slot.createdAt,
            updatedAt: slot.updatedAt,
        }));
    }

    async getAllSlots(professorId: string): Promise<SlotResponseDto[]> {
        const slots = await this.slotRepository.findAllSlots(professorId);

        return slots.map((slot) => ({
            id: slot._id.toString(),
            professor: slot.professor.toString(),
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: slot.isBooked,
            createdAt: slot.createdAt,
            updatedAt: slot.updatedAt,
        }));
    }

    async deleteSlot(slotId: string, userId: string) {
        const slot = await this.slotRepository.findSlotById(slotId);

        if (!slot) {
            throw new NotFoundError('Slot not found');
        }

        if (slot.professor.toString() !== userId) {
            throw new ForbiddenError('Not Authorized to delete this slot');
        }

        await this.slotRepository.deleteSlot(slotId);

        return true;
    }

    async updateSlot(slotId: string, updateData: UpdateSlotDto): Promise<SlotResponseDto> {
        const slot = await this.slotRepository.findSlotById(slotId);

        if (!slot) {
            throw new NotFoundError('Slot not found');
        }

        const updatedSlot = await this.slotRepository.updateSlot(slotId, {
            ...updateData,
        });

        if (!updatedSlot) {
            throw new NotFoundError("Slot can't be updated");
        }

        return {
            id: updatedSlot._id.toString(),
            professor: updatedSlot.professor.toString(),
            startTime: updatedSlot.startTime,
            endTime: updatedSlot.endTime,
            isBooked: updatedSlot.isBooked,
            createdAt: updatedSlot.createdAt,
            updatedAt: updatedSlot.updatedAt,
        };
    }
}

// TODO disalocate slot after time is passed (cron job)
