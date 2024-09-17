//TODO: Get this type
type Api = any;
console.log('api woot');
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://doge.allanjeremy.com';

export async function fetchApi<T extends keyof Api>(path: string, init?: RequestInit): Promise<ReturnType<Api[T]>> {
	const defaultInit: RequestInit = {
		credentials: 'include', // This allows sending cookies if needed
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const mergedInit = { ...defaultInit, ...init };

	try {
		const response = await fetch(`${API_BASE_URL}${path}`, mergedInit);
		if (!response.ok) {
			throw new Error(`API call failed: ${response.statusText}`);
		}
		return response.json();
	} catch (error) {
		console.error('API call error:', error);
		throw error;
	}
}
