import { Hono } from 'hono';
import { Env, Vars } from '../backend.routes';
import { handleApiSuccess, handleApiError } from '../utils/api.utils';
import { FriendService } from '../services/friend.service';
import { BadRequestError } from '../utils/error.utils';
import { validateAddFriend, validateFriendshipIdParam } from '../middleware/friend.middleware';
import { validatePaginationQuery } from '../middleware/pagination.middleware';

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

// Add a friend to a user's friend list.
app.post('/', validateAddFriend, async (c) => {
	const friendService = c.get('friendService');
	const userId = c.get('userId') as string;
	const { friendUserId } = c.req.valid('json');

	try {
		const createdFriendship = await friendService.addFriend(userId, friendUserId);

		return handleApiSuccess(c, createdFriendship, 'Friend request sent successfully', 201);
	} catch (error) {
		return handleApiError(c, error);
	}
});

// Retrieve a list of all friends for a given user.
app.get('/', validatePaginationQuery, async (c) => {
	const friendService = c.get('friendService');
	const userId = c.get('userId') as string;

	// Get query parameters with default values
	const { search: validSearch, limit: validLimit, page: validPage } = c.req.valid('query');

	const search = validSearch || null;
	const limit = parseInt(validLimit || String(FriendService.DEFAULT_FRIENDS_PER_PAGE));
	const page = parseInt(validPage || '1');

	try {
		const friendList = await friendService.getUserFriendList(userId, search, limit, page);

		return handleApiSuccess(c, friendList, 'Friend list retrieved successfully');
	} catch (error) {
		return handleApiError(c, error);
	}
});

// Confirm a friend request
app.patch('/:friendshipId', validateFriendshipIdParam, async (c) => {
	const friendService = c.get('friendService');
	const userId = c.get('userId') as string;
	const friendshipId = c.req.param('friendshipId');

	try {
		const confirmedFriendship = await friendService.confirmFriendRequest(userId, friendshipId);

		return handleApiSuccess(c, confirmedFriendship, 'Friend request confirmed successfully');
	} catch (error) {
		return handleApiError(c, error);
	}
});

// Remove a friend from a user's friend list.
app.delete('/:friendshipId', validateFriendshipIdParam, async (c) => {
	const friendService = c.get('friendService');
	const userId = c.get('userId') as string;
	const friendshipId = c.req.param('friendshipId');

	try {
		const removedFriendship = await friendService.removeFriend(userId, friendshipId);

		return handleApiSuccess(c, removedFriendship, 'Friend removed successfully');
	} catch (error) {
		return handleApiError(c, error);
	}
});

export default app;
