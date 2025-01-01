import { Document, ObjectId } from 'mongoose';

export interface DocumentWithIdTimestamps extends Document<ObjectId> {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
