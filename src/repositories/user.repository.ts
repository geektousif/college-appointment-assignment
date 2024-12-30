import { IUserModel } from '../interfaces/models/user.model.interface';
import { CheckUserDto, CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { inject, injectable } from 'tsyringe';
import { DI_TOKEN_NAMES } from '../constants/container';

@injectable()
export class UserRepository {
    constructor(@inject(DI_TOKEN_NAMES.USER_MODEL) private userModel: IUserModel) {}

    async userExists(filter: CheckUserDto) {
        return await this.userModel.exists({ ...filter });
    }

    async findUserByEmail(email: string, passwordOption?: { password: boolean }) {
        if (passwordOption?.password) {
            return await this.userModel.findOne({ email }).select('+password');
        }

        return await this.userModel.findOne({ email });
    }

    async findUserById(userId: string, passwordOption?: { password: boolean }) {
        if (passwordOption?.password) {
            return await this.userModel.findById(userId).select('+password');
        }

        return await this.userModel.findById(userId);
    }

    async createUser(newUser: CreateUserDto) {
        return await this.userModel.create(newUser);
    }

    async updateUser(userId: string, userData: UpdateUserDto) {
        return await this.userModel.findOneAndUpdate({ _id: userId }, userData, { new: true });
    }

    async clearRefreshToken(userId: string) {
        return await this.userModel.findOneAndUpdate({ _id: userId }, { refreshToken: null });
    }
}
