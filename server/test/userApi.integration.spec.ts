import { SELF } from 'cloudflare:test';
import { env } from 'hono/adapter';
import { describe, it, expect } from 'vitest';

it('dispatches fetch event', async () => {
	const response = await SELF.fetch('https://example.com');

	expect(await response.text()).toBe('HEY!');
});
