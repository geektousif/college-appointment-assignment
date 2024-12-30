import { Schema, model } from 'mongoose';
import { USER_ROLE } from '../constants/enums';

import { IUserDocument, IUserModel } from '../interfaces/models/user.model.interface';

const userSchema = new Schema<IUserDocument, IUserModel>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            required: true,
            enum: Object.values(USER_ROLE),
            default: USER_ROLE.STUDENT,
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

export const User = model<IUserDocument, IUserModel>('User', userSchema);
