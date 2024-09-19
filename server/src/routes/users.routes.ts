import { Hono } from 'hono';
import { Env, Vars } from '../api.routes';
import { handleApiError, handleApiSuccess } from '../utils/api.utils';
import { User } from '../types';
import { UserService } from '../services/user.service';
import { validateCreateUser } from '../middleware/user.middleware';
import { validatePaginationQuery } from '../middleware/pagination.middleware';

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

// Create user
app.post('/', validateCreateUser, async (c) => {
	try {
		const userService = c.get('userService');
		const createUserData = c.req.valid('json');
		const userCreated: User = await userService.createUser(createUserData);

		return handleApiSuccess(c, userCreated, 'User created');
	} catch (error: unknown) {
		return handleApiError(c, error);
	}
});

// Get users
app.get('/', validatePaginationQuery, async (c) => {
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

export default app;
