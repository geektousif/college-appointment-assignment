import { Schema, model } from 'mongoose';
import { ISlotDocument, ISlotModel } from '../interfaces/models/slot.model.interface';

const slotSchema = new Schema<ISlotDocument, ISlotModel>(
    {
        professor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        isBooked: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Slot = model<ISlotDocument, ISlotModel>('Slot', slotSchema);
