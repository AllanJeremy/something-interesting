// This file contains custom error classes that extend the base Error class
// We are not using HTTPException because we want to have more control over the error responses & not to be locked to Hono (though this is inspired by Hono's HTTPException structure)
import { StatusCode } from 'hono/utils/http-status';
import { ZodError } from 'zod';

// Added here so we can always replace this with a different type if we want to (eg. if we are not using Hono anymore)
type HttpStatusCode = StatusCode;

export class ApiError<T = any> extends Error {
	constructor(message: string, public cause?: T, public status: HttpStatusCode = 500) {
		super(message);
	}
}

export class BadRequestError extends ApiError {
	constructor(message: string, cause?: string) {
		super(`Bad Request: ${message}`, cause, 400);
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message: string, cause?: string) {
		super(`Unauthorized: ${message}`, cause, 401);
	}
}

export class ForbiddenError extends ApiError {
	constructor(message: string, cause?: string) {
		super(`Forbidden: ${message}`, cause, 403);
	}
}
export class NotFoundError extends ApiError {
	constructor(message: string, cause?: string) {
		super(`Not Found: ${message}`, cause, 404);
	}
}

export class ConflictError extends ApiError {
	constructor(message: string, cause?: string) {
		super(`Conflict: ${message}`, cause, 409);
	}
}

export class InternalServerError extends ApiError {
	constructor(message: string, cause?: string) {
		super(`Internal Server Error: ${message}`, cause, 500);
	}
}

/**
 * Converts a Zod error into a user-friendly error message
 * @description This function takes a ZodError object and formats its issues into a readable string
 * @param error The ZodError object to be formatted
 * @returns {string} A formatted string containing all error messages and their corresponding paths
 */

export function getFriendlyZodErrorMessage(error: ZodError) {
	// Formats into something like "Required: name & Invalid UUID: friendlyUserId"
	const message = error.issues.map((issue) => `${issue.message}: ${issue.path.join(', ')}`).join(' & ');
	return message;
}
