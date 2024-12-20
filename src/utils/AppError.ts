class AppError extends Error {
    statusCode: number;
    errors: any[];

    constructor(statusCode: number, message = 'Something went wrong', errors: any[] = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = Array.isArray(errors) ? errors : [];
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(404, message);
    }
}

class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(409, message);
    }
}

export { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError, ConflictError };

export default AppError;
