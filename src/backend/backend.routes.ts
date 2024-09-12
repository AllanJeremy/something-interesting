//? In the event that we have more routes, we can
import { Hono } from 'hono';
import userRoutes from './routes/users.routes';
import userFriendsRoutes from './routes/userFriends.routes';
import { UserService } from './services/user.service';

export type Env = {
	DATABASE_URL: string;
};

export type Vars = { userService: UserService };

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

app.use('*', async (c, next) => {
	// Configure the UserService for all backend routes with the database url
	const userService = new UserService(c.env.DATABASE_URL);

	//? (Dependency Injection) Inject the userService in the context so we don't have to create a new instance on every request
	c.set('userService', userService);

	console.log('db url [bruh]: ', c.env.DATABASE_URL);
	await next();
});

app.route('/users', userRoutes);
app.route('/users/:id/friends', userFriendsRoutes);

export default app;
