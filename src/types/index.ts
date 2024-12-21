import { Request } from 'express';
import { USER_ROLE } from '../constants/enums';

export type UserRole = keyof typeof USER_ROLE;

export type JWTTokenPayload = {
    id: number;
    role: UserRole;
    email?: string;
};

export type JWTRefreshTokenPayload = {
    id: number;
};

export interface RequestUser extends Request {
    user?: JWTTokenPayload;
}
