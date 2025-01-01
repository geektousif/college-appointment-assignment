import { Model, Schema } from 'mongoose';
import { DocumentWithIdTimestamps } from '../utils/modelHelper';

export interface ISlotDocument extends DocumentWithIdTimestamps {
    professor: Schema.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
}

export interface ISlotModel extends Model<ISlotDocument> {}
