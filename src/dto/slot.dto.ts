import { CheckSlotAvailabilitySchema, CreateSlotSchema, UpdateSlotSchema } from '../validators/slot.validator';
import { UserResponseDto } from './user.dto';

export interface CreateSlotDto extends CreateSlotSchema {
    professor: string;
}

export interface UpdateSlotDto extends UpdateSlotSchema {}

export interface checkSlotAvailabilityDto extends CheckSlotAvailabilitySchema {
    professor: string;
}

export interface SlotResponseDto {
    id: string;
    professor: Pick<UserResponseDto, 'id' | 'name' | 'email'> | string;
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
    createdAt: Date;
    updatedAt: Date;
}
