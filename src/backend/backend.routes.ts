//? In the event that we have more routes, we can add them in this file

import { Hono } from 'hono';
import { createDbConnection, DatabaseConnection } from './db';

// Routes
import userRoutes from './routes/users.routes';
import userFriendsRoutes from './routes/userFriends.routes';

//#region Service imports
import { UserService } from './services/user.service';
import { FriendService } from './services/friend.service';
import { handleApiError } from './utils/api.utils';
import { InternalServerError } from './utils/error.utils';
//#endregion Service imports

export type Env = {
	DATABASE_URL: string;
};

// Register any services that are used in the backend here
export type Vars = { userService: UserService; friendService: FriendService; userId?: string };

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

//#region DB connection
// Create a single database connection for the entire application lifecycle
let dbConnection: DatabaseConnection | null = null;

/**
 * [Optimization] Retrieves or creates a database connection.
 * @description This function ensures that only one database connection is created
 * for the entire application lifecycle, improving performance and
 * resource utilization.
 * @param databaseUrl - The URL of the database to connect to
 * @returns The database connection instance
 */
function getDbConnection(databaseUrl: string): DatabaseConnection {
	if (!dbConnection) {
		dbConnection = createDbConnection(databaseUrl);
	}
	return dbConnection;
}
//#endregion DB connection

//#region Middleware

//? If we had more services, we could only inject the services that are needed for that route
app.use('*', async (c, next) => {
	const db = getDbConnection(c.env.DATABASE_URL);

	// Configure the UserService for all backend routes with the database connection
	//? (Dependency Injection) Inject services into the context so we don't have to create a new instance on every request
	const userService = new UserService(db);
	c.set('userService', userService);

	const friendService = new FriendService(db, userService);
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
//#endregion Middleware

//#region Routes
app.route('/users', userRoutes);
app.route('/users/:userId/friends', userFriendsRoutes);
//#endregion Routes

//#region Error handling
app.onError((error, c) => {
	return handleApiError(c, new InternalServerError(error.message));
});
//#endregion Error handling

export default app;
