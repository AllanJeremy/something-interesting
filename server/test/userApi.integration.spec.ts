import { SELF, env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';

it('dispatches fetch event', async () => {
	console.log('env:', env);
	const response = await SELF.fetch('https://example.com');

	expect(await response.text()).toBe('HEY!');
});
