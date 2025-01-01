import { SlotRepository } from '../repositories/slot.repository';

import { checkSlotAvailabilityDto, CreateSlotDto, SlotResponseDto, UpdateSlotDto } from '../dto/slot.dto';
import AppError, { BadRequestError, ForbiddenError, NotFoundError } from '../utils/AppError';
import { inject, injectable } from 'tsyringe';
import { DI_TOKEN_NAMES } from '../constants/container';

@injectable()
export class SlotService {
    constructor(@inject(DI_TOKEN_NAMES.SLOT_REPOSITORY) private slotRepository: SlotRepository) {}

    async createSlot(slotData: CreateSlotDto): Promise<SlotResponseDto> {
        try {
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
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Failed to create slot');
        }
    }

    async searchSlots(data: checkSlotAvailabilityDto): Promise<SlotResponseDto[]> {
        try {
            const slots = await this.slotRepository.findAvailableSlots({
                professor: data.professor,
                startTime: data.startTime,
                endTime: data.endTime,
            });

            // if (!slots.length) {
            //     return [];
            // }

            return slots.map((slot) => ({
                id: slot._id.toString(),
                professor: slot.professor.toString(),
                startTime: slot.startTime,
                endTime: slot.endTime,
                isBooked: slot.isBooked,
                createdAt: slot.createdAt,
                updatedAt: slot.updatedAt,
            }));
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Failed to search slots');
        }
    }

    async getAllSlots(professorId: string): Promise<SlotResponseDto[]> {
        try {
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
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Failed to get slots');
        }
    }

    async deleteSlot(slotId: string, userId: string): Promise<boolean> {
        try {
            const slot = await this.slotRepository.findSlotById(slotId);

            if (!slot) {
                throw new NotFoundError('Slot not found');
            }

            if (slot.professor.toString() !== userId) {
                throw new ForbiddenError('Not Authorized to delete this slot');
            }

            await this.slotRepository.deleteSlot(slotId);

            return true;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Failed to delete slot');
        }
    }

    async updateSlot(slotId: string, updateData: UpdateSlotDto): Promise<SlotResponseDto> {
        try {
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
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Failed to update slot');
        }
    }
}

// TODO disalocate slot after time is passed (cron job)
