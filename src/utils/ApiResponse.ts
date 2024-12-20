export const ApiResponse = (statusCode: number, message: string, data: any[] | object | null) => {
    const success = statusCode < 400;

    return {
        success,
        statusCode,
        message,
        data: success ? data : null,
        errors: success ? null : data,
    };
};
