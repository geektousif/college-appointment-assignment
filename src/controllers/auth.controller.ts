import asyncHandler from '../utils/asyncHandler';
import authService from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { userSelectSchema } from '../dto/user.dto';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../utils/jwtHelpers';

const register = asyncHandler(async (req, res) => {
    const { email, password, role, name } = req.body;

    const user = await authService.register({ email, password, role, name });

    const returnUser = await userSelectSchema.parseAsync(user);

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

const logout = asyncHandler(async (_req, res) => {
    return res
        .status(200)
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .json(ApiResponse(200, 'Logout successful', null));
});

const me = asyncHandler(async (req, res) => {
    const user = await userSelectSchema.partial().parseAsync(req.user);

    return res.status(200).json(ApiResponse(200, 'Success', user));
});

// TODO
// const refreshToken = asyncHandler(async (req, res) => {});

export default {
    register,
    login,
    logout,
    me,
};
