// This file contains custom error classes that extend the base Error class
// We are not using HTTPException because we want to have more control over the error responses & not to be locked to Hono (though this is inspired by Hono's HTTPException structure)
import { StatusCode } from 'hono/utils/http-status';
import { ZodError } from 'zod';

// Added here so we can always replace this with a different type if we want to (eg. if we are not using Hono anymore)
type HttpStatusCode = StatusCode;
/**
 * Base class for API errors
 * @template T - The type of the cause (optional)
 */
export class ApiError<T = any> extends Error {
	/**
	 * Creates an instance of ApiError
	 * @param message - The error message
	 * @param cause - The cause of the error (optional)
	 * @param status - The HTTP status code (default: 500)
	 */
	constructor(message: string, public cause?: T, public status: HttpStatusCode = 500) {
		super(message);
	}
}

/**
 * Error class for Bad Request (400) errors
 */
export class BadRequestError extends ApiError {
	/**
	 * Creates an instance of BadRequestError
	 * @param message - The error message
	 * @param cause - The cause of the error (optional)
	 */
	constructor(message: string, cause?: string) {
		super(`Bad Request: ${message}`, cause, 400);
	}
}

/**
 * Error class for Unauthorized (401) errors
 */
export class UnauthorizedError extends ApiError {
	/**
	 * Creates an instance of UnauthorizedError
	 * @param message - The error message
	 * @param cause - The cause of the error (optional)
	 */
	constructor(message: string, cause?: string) {
		super(`Unauthorized: ${message}`, cause, 401);
	}
}

/**
 * Error class for Forbidden (403) errors
 */
export class ForbiddenError extends ApiError {
	/**
	 * Creates an instance of ForbiddenError
	 * @param message - The error message
	 * @param cause - The cause of the error (optional)
	 */
	constructor(message: string, cause?: string) {
		super(`Forbidden: ${message}`, cause, 403);
	}
}

/**
 * Error class for Not Found (404) errors
 */
export class NotFoundError extends ApiError {
	/**
	 * Creates an instance of NotFoundError
	 * @param message - The error message
	 * @param cause - The cause of the error (optional)
	 */
	constructor(message: string, cause?: string) {
		super(`Not Found: ${message}`, cause, 404);
	}
}

/**
 * Error class for Conflict (409) errors
 */
export class ConflictError extends ApiError {
	/**
	 * Creates an instance of ConflictError
	 * @param message - The error message
	 * @param cause - The cause of the error (optional)
	 */
	constructor(message: string, cause?: string) {
		super(`Conflict: ${message}`, cause, 409);
	}
}

/**
 * Error class for Internal Server Error (500) errors
 */
export class InternalServerError extends ApiError {
	/**
	 * Creates an instance of InternalServerError
	 * @param message - The error message
	 * @param cause - The cause of the error (optional)
	 */
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
