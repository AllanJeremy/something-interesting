import { ApiError } from '../utils/error.utils';

export interface ApiSuccessResponse<T> {
	readonly ok: true;
	readonly data: T;
	readonly message: string;
}

export interface ApiErrorResponse<E = ApiError> {
	readonly ok: false;
	readonly message: string;
	readonly error?: E;
}

export type ApiResponse<T, E = unknown> = ApiSuccessResponse<T> | ApiErrorResponse<E>;
