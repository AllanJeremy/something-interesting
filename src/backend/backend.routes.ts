//? In the event that we have more routes, we can
import { Hono } from 'hono';

// Routes
import userRoutes from './routes/users.routes';
import userFriendsRoutes from './routes/userFriends.routes';

// Services
import { UserService } from './services/user.service';

export type Env = {
	DATABASE_URL: string;
};

export type Vars = { userService: UserService; userId?: string };

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

//? If we had more services, we could only inject the services that are needed for that route
app.use('*', async (c, next) => {
	// Configure the UserService for all backend routes with the database url
	const userService = new UserService(c.env.DATABASE_URL);

	//? (Dependency Injection) Inject the userService in the context so we don't have to create a new instance on every request
	c.set('userService', userService);

	await next();
});

// Set userId for users/:userId routes
app.use('/users/:userId/*', async (c, next) => {
	const userId = c.req.param('userId');
	if (!userId) {
		return c.json({ error: 'User ID is required' }, 400);
	}
	c.set('userId', userId);
	await next();
});

app.route('/users', userRoutes);

app.route('/users/:userId/friends', userFriendsRoutes);

export default app;
