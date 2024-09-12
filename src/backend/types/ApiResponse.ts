export interface ApiResponse<T> {
	readonly ok: boolean;
	readonly data?: T;
	readonly message: string;
	readonly error?: Record<string, unknown> | string;
}
