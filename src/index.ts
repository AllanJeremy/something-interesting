import { Hono } from 'hono';
import backendRoutes from './backend/backend.routes';
import frontendRoutes from './frontend/frontend.routes';

const app = new Hono<{ Bindings: Env }>();

app.route('/', frontendRoutes);

app.route('/api', backendRoutes);

export default app;
