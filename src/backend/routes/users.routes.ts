import { Hono } from 'hono';
import { Env, Vars } from '../backend.routes';
import { generateApiErrorResponse, generateApiSuccessResponse } from '../utils/api.utils';
import { CreateUserData, User } from '../types';

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

//#region Users
// Create a new user.
//TODO: Add validation for the request body using Zod
app.post('/', async (c) => {
	try {
		const userService = c.get('userService');

		const body = await c.req.json();
		const createUserData: CreateUserData = {
			username: body.username,
			email: body.email,
		};

		const userCreated: User = await userService.createUser(createUserData);

		console.log('userCreated: ', userCreated);

		return c.json(generateApiSuccessResponse<User>(userCreated, 'User created'));
	} catch (error: unknown) {
		return c.json(generateApiErrorResponse(error, 'User creation failed'));
	}
});

// Retrieve a list of all users.
app.get('/', async (c) => {
	const userService = c.get('userService');

	const usersFound: User[] = await userService.getAllUsers();

	return c.json({ message: 'listing all users', data: usersFound });
});

//#endregion Users

export default app;
