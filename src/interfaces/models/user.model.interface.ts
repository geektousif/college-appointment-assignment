import { Model } from 'mongoose';
import { USER_ROLE } from '../../constants/enums';
import { DocumentWithIdTimestamps } from '../utils/modelHelper';

export interface IUserDocument extends DocumentWithIdTimestamps {
    name: string;
    email: string;
    password: string;
    role: USER_ROLE;
    refreshToken: string;
}

export interface IUserModel extends Model<IUserDocument> {}
