import { Hono } from 'hono';
import { Vars } from '../api.routes';
import { handleApiSuccess, handleApiError } from '../utils/api.utils';
import { UserAndFriendshipStats } from '../types';

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

app.get('/', async (c) => {
	const userService = c.get('userService');
	const friendService = c.get('friendService');

	try {
		const userStats = await userService.getUserStats();
		const friendshipStats = await friendService.getFriendshipStats();

		const userAndFriendshipStats: UserAndFriendshipStats = {
			users: userStats,
			friendships: friendshipStats,
		};

		return handleApiSuccess<UserAndFriendshipStats>(c, userAndFriendshipStats, 'Stats found');
	} catch (error: unknown) {
		return handleApiError(c, error);
	}
});

export default app;
