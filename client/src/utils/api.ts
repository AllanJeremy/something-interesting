import { ApiResponse } from "@server/types";

const API_BASE_URL = "https://api.aj-doge.workers.dev";

async function _fetchApi<T>(
	path: string,
	init?: RequestInit
): Promise<ApiResponse<T>> {
	const url = `${API_BASE_URL}/${path}`;

	const response = await fetch(url, init);
	const apiResponse = (await response.json()) as ApiResponse<T>;

	return apiResponse;
}

export function getRequest<T = unknown>(path: string, init?: RequestInit) {
	return _fetchApi<T>(path, { ...init, method: "GET" });
}

export function postRequest<T = unknown>(path: string, init?: RequestInit) {
	return _fetchApi<T>(path, { ...init, method: "POST" });
}

export function patchRequest<T = unknown>(path: string, init?: RequestInit) {
	return _fetchApi<T>(path, { ...init, method: "PATCH" });
}

export function deleteRequest<T = unknown>(path: string, init?: RequestInit) {
	return _fetchApi<T>(path, { ...init, method: "PATCH" });
}
