import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
	return c.text('Updated: React app will go here');
});

//TODO: Handle errors

export default app;
