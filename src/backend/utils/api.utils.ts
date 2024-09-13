import { ApiErrorResponse, ApiSuccessResponse } from '../types';

export function generateApiErrorResponse<E = unknown>(error: E, message?: string): ApiErrorResponse<E> {
	return {
		ok: false,
		message: message ?? 'An error occurred',
		error,
	};
}

export function generateApiSuccessResponse<T>(data: T, message?: string): ApiSuccessResponse<T> {
	return {
		ok: true,
		data,
		message: message ?? 'Action was successful',
	};
}
