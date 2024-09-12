export interface ApiSuccessResponse<T> {
	readonly ok: true;
	readonly data: T;
	readonly message: string;
}

export interface ApiErrorResponse<E = unknown> {
	readonly ok: false;
	readonly message: string;
	readonly error?: E; // TODO: Consider using a custom error type
}

export type ApiResponse<T, E = unknown> = ApiSuccessResponse<T> | ApiErrorResponse<E>;
