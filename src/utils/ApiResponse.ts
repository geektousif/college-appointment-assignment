export const SuccessResponse = (statusCode: number, message: string, data?: any) => {
    return {
        success: true,
        statusCode,
        message,
        data,
    };
};

export const ErrorResponse = (statusCode: number, message: string, errors?: any[]) => {
    return {
        success: false,
        statusCode,
        message,
        errors,
    };
};
