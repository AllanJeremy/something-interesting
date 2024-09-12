import { Hono } from 'hono';
import { UserService } from '../services/user.service';

const app = new Hono<{ Bindings: Env }>();

const userService = new UserService();

//#region Users
// Create a new user.
app.post('/', async (c) => {
	const userCreated = await userService.createUser({
		username: 'Allan',
		email: 'aj.dev254@gmail.com',
	});

	console.log('userCreated: ', userCreated);

	return c.json({ message: 'User created', data: userCreated });
});

// Retrieve a list of all users.
app.get('/', async (c) => {
	return c.json({ message: 'listing all users' });
});

//#endregion Users

export default app;
