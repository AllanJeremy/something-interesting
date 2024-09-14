import { StatusCode } from 'hono/utils/http-status';

export class ApiError extends Error {
	constructor(message: string, public statusCode: StatusCode = 500) {
		super(message);
	}
}

export class BadRequestError extends ApiError {
	constructor(message: string) {
		super(`Bad Request: ${message}`, 400);
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message: string) {
		super(`Unauthorized: ${message}`, 401);
	}
}

export class ForbiddenError extends ApiError {
	constructor(message: string) {
		super(`Forbidden: ${message}`, 403);
	}
}
export class NotFoundError extends ApiError {
	constructor(message: string) {
		super(`Not Found: ${message}`, 404);
	}
}

export class ConflictError extends ApiError {
	constructor(message: string) {
		super(`Conflict: ${message}`, 409);
	}
}

export class InternalServerError extends ApiError {
	constructor(message: string) {
		super(`Internal Server Error: ${message}`, 500);
	}
}
