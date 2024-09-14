import { Hono } from 'hono';
import { Env, Vars } from '../backend.routes';
import { handleApiError, handleApiSuccess } from '../utils/api.utils';
import { CreateUserData, User } from '../types';
import { UserService } from '../services/user.service';

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

		return handleApiSuccess(c, userCreated, 'User created');
	} catch (error: unknown) {
		return handleApiError(c, error);
	}
});

// Retrieve a list of all users.
app.get('/', async (c) => {
	const userService = c.get('userService');

	try {
		// Get query parameters with default values
		const searchQuery: string | null = c.req.query('search') || null;
		const limit = parseInt(c.req.query('limit') || String(UserService.DEFAULT_USERS_PER_PAGE));
		const page = parseInt(c.req.query('page') || '1');

		const usersFound: User[] = await userService.getAllUsers(searchQuery, limit, page);

		return handleApiSuccess(c, usersFound, 'Users found');
	} catch (error: unknown) {
		return handleApiError(c, error);
	}
});

//#endregion Users

export default app;
