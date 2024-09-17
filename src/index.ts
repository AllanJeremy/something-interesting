import { Hono } from 'hono';
import backendRoutes from './backend/backend.routes';
import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: Env }>();

app.use(
	'*',
	// TODO: Get live URL from env
	cors({
		origin: ['http://localhost:5173', 'https://your-production-frontend-url.com'],
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);

app.route('/api', backendRoutes);

export default app;
