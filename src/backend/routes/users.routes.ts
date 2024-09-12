import { Hono } from 'hono';
import { Env, Vars } from '../backend.routes';

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

//#region Users
// Create a new user.
app.post('/', async (c) => {
	const userService = c.get('userService');

	const userCreated = await userService.createUser({
		username: 'Allan',
		email: 'aj.dev254@gmail.com',
	});

	console.log('userCreated: ', userCreated);

	return c.json({ message: 'User created', data: userCreated });
});

// Retrieve a list of all users.
app.get('/', async (c) => {
	const userService = c.get('userService');

	return c.json({ message: 'listing all users' });
});

//#endregion Users

export default app;
