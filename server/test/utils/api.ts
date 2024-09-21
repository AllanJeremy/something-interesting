import { SELF, env } from 'cloudflare:test';
import { assert } from 'vitest';

// TODO: Add typesafety to avoid casts
const apiBaseUrl = (env as any).API_BASE_URL as string;

// Ensure the base url is setup correctly before attempting to run tests
assert(apiBaseUrl, '[ERROR] API url is not defined in .dev.vars. Please look at .dev.vars.example for how this should be setup.');

export function testApiFetch(path: string, init?: RequestInit) {
	return SELF.fetch(`${apiBaseUrl}${path}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...init?.headers,
		},
	});
}
