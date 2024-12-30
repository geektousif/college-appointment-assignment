// import { IUser } from '../types/interfaces/IUser';

import { CreateUserSchema, UpdateUserSchema } from '../validators/user.validator';

// export interface CreateUserDto extends IUser {
//     password: string;
// }

// export interface LoginUserDto {
//     email: string;
//     password: string;
// }

// export interface UserResponseDto extends Omit<IUser, 'password'> {}

// export interface TokenResponseDto {
//     accessToken?: string;
//     refreshToken?: string;
// }

// export interface UpdateUserDto extends Partial<IUser> {}

export interface CreateUserDto extends CreateUserSchema {}

export interface LoginUserDto extends Pick<CreateUserSchema, 'email' | 'password'> {}

export interface UpdateUserDto extends UpdateUserSchema {
    refreshToken?: string;
}

export interface CheckUserDto extends UpdateUserDto {}

export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
