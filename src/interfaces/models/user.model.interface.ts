import { Model } from 'mongoose';
import { USER_ROLE } from '../../constants/enums';
import { DocumentWithIdTimestamps } from '.';

export interface IUserDocument extends DocumentWithIdTimestamps {
    name: string;
    email: string;
    password: string;
    role: USER_ROLE;
    refreshToken: string;
}

export interface IUserModel extends Model<IUserDocument> {}
