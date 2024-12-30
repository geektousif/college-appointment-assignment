import asyncHandler from '../utils/asyncHandler';
import { UserService } from '../services/user.service';
import { SuccessResponse } from '../utils/ApiResponse';
import { UnauthorizedError } from '../utils/AppError';
import { CreateUserDto, LoginUserDto, UserResponseDto } from '../dto/user.dto';
import { accessCookieOptions, refreshCookieOptions } from '../utils/cookieOptions';
import { COOKIE_NAMES } from '../constants';
import { inject, injectable } from 'tsyringe';
import { DI_TOKEN_NAMES } from '../constants/container';

@injectable()
export class UserController {
    constructor(@inject(DI_TOKEN_NAMES.USER_SERVICE) private userService: UserService) {}

    register = asyncHandler(async (req, res) => {
        const registerData: CreateUserDto = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            role: req.body.role,
        };

        const user = (await this.userService.register(registerData)) as UserResponseDto;

        return res.status(201).json(SuccessResponse(201, 'User created successfully', user));
    });

    login = asyncHandler(async (req, res) => {
        const loginData: LoginUserDto = {
            email: req.body.email,
            password: req.body.password,
        };

        const { accessToken, refreshToken } = await this.userService.login(loginData);

        return res
            .status(200)
            .cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, accessCookieOptions)
            .cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, refreshCookieOptions)
            .json(SuccessResponse(200, 'Login successful', { accessToken, refreshToken }));
    });

    logout = asyncHandler(async (req, res) => {
        await this.userService.logout(req.user?.id as string);
        return res
            .status(200)
            .clearCookie('accessToken')
            .clearCookie('refreshToken')
            .json(SuccessResponse(200, 'Logout successful'));
    });

    getMe = asyncHandler(async (req, res) => {
        const user = await this.userService.getUserById(req.user?.id as string);

        return res.status(200).json(SuccessResponse(200, 'Success', user));
    });

    // TODO
    refreshToken = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedError('Invalid refresh token');
        }

        const { accessToken } = await this.userService.refreshAccessToken(refreshToken);

        return res
            .status(200)
            .cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, accessCookieOptions)
            .json(SuccessResponse(200, 'Token refreshed successfully', { accessToken }));
    });
}
