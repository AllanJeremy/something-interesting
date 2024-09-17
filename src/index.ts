import { Hono } from 'hono';
import backendRoutes from './backend/backend.routes';

const app = new Hono<{ Bindings: Env }>();

app.route('/api', backendRoutes);

export default app;
