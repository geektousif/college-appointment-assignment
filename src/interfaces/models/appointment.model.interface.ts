import { Model, Schema } from 'mongoose';
import { APPOINTMENT_STATUS } from '../../constants/enums';
import { DocumentWithIdTimestamps } from '.';

export interface IAppointmentDocument extends DocumentWithIdTimestamps {
    professor: Schema.Types.ObjectId;
    student: Schema.Types.ObjectId;
    slot: Schema.Types.ObjectId;
    status: APPOINTMENT_STATUS;
    cancelledBy?: Schema.Types.ObjectId;
}

export interface IAppointmentModel extends Model<IAppointmentDocument> {}
