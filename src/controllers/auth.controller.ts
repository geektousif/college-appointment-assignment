import asyncHandler from '../utils/asyncHandler';
import { authService } from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { selectUserSchema } from '../dto/user.dto';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../utils/jwtHelpers';
import { UnauthorizedError } from '../utils/AppError';

const register = asyncHandler(async (req, res) => {
    const { email, password, role, name } = req.body;

    const user = await authService.register({ email, password, role, name });

    const returnUser = await selectUserSchema.parseAsync(user);

    return res.status(201).json(ApiResponse(201, 'User created successfully', returnUser));
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await authService.login(email, password);

    return res
        .status(200)
        .cookie('accessToken', accessToken, accessTokenCookieOptions)
        .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
        .json(ApiResponse(200, 'Login successful', { accessToken, refreshToken }));
});

const logout = asyncHandler(async (req, res) => {
    await authService.logout(Number(req.user?.id));
    return res
        .status(200)
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .json(ApiResponse(200, 'Logout successful', null));
});

const getMe = asyncHandler(async (req, res) => {
    const user = await selectUserSchema.partial().parseAsync(req.user);

    return res.status(200).json(ApiResponse(200, 'Success', user));
});

// TODO
const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
        throw new UnauthorizedError('Invalid refresh token');
    }

    const { accessToken } = await authService.refreshAccessToken(refreshToken);

    return res
        .status(200)
        .cookie('accessToken', accessToken, accessTokenCookieOptions)
        .json(ApiResponse(200, 'Token refreshed successfully', { accessToken }));
});

export const authController = {
    register,
    login,
    logout,
    getMe,
    refreshToken,
};
