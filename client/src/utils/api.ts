import { ApiResponse } from "@server/types";

const API_BASE_URL = "https://api.aj-doge.workers.dev";

export async function fetchApi<T>(
	path: string,
	init?: RequestInit
): Promise<ApiResponse<T>> {
	return {
		ok: true,
		message: "",
		data: {} as T,
	};
}
