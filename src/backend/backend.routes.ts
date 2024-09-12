//? In the event that we have more routes, we can
import { Hono } from 'hono';
import userRoutes from './routes/users.routes';
import userFriendsRoutes from './routes/userFriends.routes';

const app = new Hono();

app.route('/users', userRoutes);
app.route('/users/:id/friends', userFriendsRoutes);

export default app;
