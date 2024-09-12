import { ApiResponse } from '../types';

export function generateApiErrorResponse<T>(error: Record<string, unknown> | string, message?: string): ApiResponse<T> {
	return {
		ok: false,
		message: message ?? 'An error occurred',
		error,
	};
}

export function generateApiSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
	return {
		ok: true,
		data,
		message: message ?? 'Action was successful',
	};
}
