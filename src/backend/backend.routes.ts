//? In the event that we have more routes, we can
import { Hono } from 'hono';

// Routes
import userRoutes from './routes/users.routes';
import userFriendsRoutes from './routes/userFriends.routes';

//#region Service imports
import { UserService } from './services/user.service';
import { FriendService } from './services/friend.service';
//#endregion Service imports

export type Env = {
	DATABASE_URL: string;
};

// Register any services that are used in the backend here
export type Vars = { userService: UserService; friendService: FriendService; userId?: string };

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

//? If we had more services, we could only inject the services that are needed for that route
app.use('*', async (c, next) => {
	// Configure the UserService for all backend routes with the database url
	//? (Dependency Injection) Inject services into the context so we don't have to create a new instance on every request
	const userService = new UserService(c.env.DATABASE_URL);
	c.set('userService', userService);

	const friendService = new FriendService(c.env.DATABASE_URL);
	c.set('friendService', friendService);

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
