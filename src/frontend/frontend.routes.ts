import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
	return c.text('Updated: React app will go here');
});

export default app;
