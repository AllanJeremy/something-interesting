import { Hono } from 'hono';
import backendRoutes from './backend/backend.routes';
import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: Env }>();

app.use(
	'*',
	// TODO: Get live URL from env
	cors({
		origin: ['https://doge.allanjeremy.com'],
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);

app.route('/', backendRoutes);

export default app;
