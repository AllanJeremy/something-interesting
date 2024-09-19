import { ApiSuccessResponse } from "@server/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function _fetchApi<T>(
	path: string,
	init?: RequestInit
): Promise<ApiSuccessResponse<T>> {
	const url = `${API_BASE_URL}/${path}`;
	console.log("Vite config loaded", import.meta.env.DEV);

	const response = await fetch(url, init);
	const apiResponse = (await response.json()) as ApiSuccessResponse<T>;

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
