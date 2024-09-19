import { ApiSuccessResponse } from "@server/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches data from the API.
 * @template T - The type of the response data.
 * @param {string} path - The API endpoint path.
 * @param {RequestInit} [init] - Optional fetch initialization options.
 * @returns {Promise<ApiSuccessResponse<T>>} A promise that resolves to the API response.
 */
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

/**
 * Sends a GET request to the API.
 * @template T - The type of the response data.
 * @param {string} path - The API endpoint path.
 * @param {RequestInit} [init] - Optional fetch initialization options.
 * @returns {Promise<ApiSuccessResponse<T>>} A promise that resolves to the API response.
 */
export function getRequest<T = unknown>(path: string, init?: RequestInit) {
	return _fetchApi<T>(path, { ...init, method: "GET" });
}

/**
 * Sends a POST request to the API.
 * @template T - The type of the response data.
 * @template D - The type of the request data.
 * @param {string} path - The API endpoint path.
 * @param {D} [data] - The data to send in the request body.
 * @param {RequestInit} [init] - Optional fetch initialization options.
 * @returns {Promise<ApiSuccessResponse<T>>} A promise that resolves to the API response.
 */
export function postRequest<T = unknown, D = Record<string, unknown>>(
	path: string,
	data?: D,
	init?: RequestInit
) {
	const body = JSON.stringify(data);

	return _fetchApi<T>(path, { ...init, method: "POST", body });
}

/**
 * Sends a PATCH request to the API.
 * @template T - The type of the response data.
 * @template D - The type of the request data.
 * @param {string} path - The API endpoint path.
 * @param {D} [data] - The data to send in the request body.
 * @param {RequestInit} [init] - Optional fetch initialization options.
 * @returns {Promise<ApiSuccessResponse<T>>} A promise that resolves to the API response.
 */
export function patchRequest<T = unknown, D = Record<string, unknown>>(
	path: string,
	data?: D,
	init?: RequestInit
) {
	const body = JSON.stringify(data);

	return _fetchApi<T>(path, { ...init, method: "PATCH", body });
}

/**
 * Sends a DELETE request to the API.
 * @template T - The type of the response data.
 * @param {string} path - The API endpoint path.
 * @param {RequestInit} [init] - Optional fetch initialization options.
 * @returns {Promise<ApiSuccessResponse<T>>} A promise that resolves to the API response.
 */
export function deleteRequest<T = unknown>(path: string, init?: RequestInit) {
	return _fetchApi<T>(path, { ...init, method: "DELETE" });
}
