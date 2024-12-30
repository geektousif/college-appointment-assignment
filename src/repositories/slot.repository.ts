import { ClientSession, FilterQuery } from 'mongoose';
import { checkSlotAvailabilityDto, CreateSlotDto, UpdateSlotDto } from '../dto/slot.dto';
import { ISlotDocument, ISlotModel } from '../interfaces/models/slot.model.interface';
import { inject, injectable } from 'tsyringe';
import { DI_TOKEN_NAMES } from '../constants/container';

@injectable()
export class SlotRepository {
    constructor(@inject(DI_TOKEN_NAMES.SLOT_MODEL) private slotModel: ISlotModel) {}

    async findAllSlots(professorId: string) {
        return await this.slotModel.find({ professor: professorId });
    }

    async findAvailableSlots(data: checkSlotAvailabilityDto) {
        const filter: FilterQuery<ISlotDocument> = {
            professor: data.professor,
            isBooked: false,
        };

        if (data.startTime) {
            filter.startTime = { $gte: data.startTime };
        }
        if (data.endTime) {
            filter.endTime = { $lte: data.endTime };
        }

        const availableSlots = await this.slotModel.find(filter);
        return availableSlots;
    }

    async findSlotById(slotId: string) {
        return await this.slotModel.findById(slotId);
    }

    async createSlot(data: CreateSlotDto) {
        return await this.slotModel.create({
            professor: data.professor,
            startTime: data.startTime,
            endTime: data.endTime,
        });
    }

    async deleteSlot(slotId: string) {
        return await this.slotModel.findByIdAndDelete(slotId);
    }

    async updateSlot(slotId: string, data: UpdateSlotDto, session?: ClientSession) {
        return await this.slotModel.findByIdAndUpdate(
            slotId,
            {
                ...data,
            },
            { new: true, session },
        );
    }
}
