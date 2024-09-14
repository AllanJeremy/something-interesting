import { Hono } from 'hono';
import { Env, Vars } from '../backend.routes';
import { handleApiSuccess, handleApiError } from '../utils/api.utils';
import { FriendService } from '../services/friend.service';
import { BadRequestError } from '../utils/error.utils';

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

// Add a friend to a user's friend list.
app.post('/', async (c) => {
	const friendService = c.get('friendService');
	const userId = c.get('userId') as string;

	const body = await c.req.json();
	const friendUserId = body.friendUserId;

	// TODO: Handle this in zod middleware
	if (!friendUserId) {
		throw new BadRequestError('Validation error: Friend user ID is required');
	}

	try {
		const createdFriendship = await friendService.addFriend(userId, friendUserId);

		return handleApiSuccess(c, createdFriendship, 'Friend request sent successfully', 201);
	} catch (error) {
		return handleApiError(c, error);
	}
});

// Retrieve a list of all friends for a given user.
app.get('/', async (c) => {
	const friendService = c.get('friendService');
	const userId = c.get('userId') as string;

	// Get query parameters with default values
	const limit = parseInt(c.req.query('limit') || String(FriendService.DEFAULT_FRIENDS_PER_PAGE));
	const page = parseInt(c.req.query('page') || '1');

	try {
		const friendList = await friendService.getUserFriendList(userId, limit, page);

		return handleApiSuccess(c, friendList, 'Friend list retrieved successfully');
	} catch (error) {
		return handleApiError(c, error);
	}
});

// Confirm a friend request
app.patch('/:friendshipId', async (c) => {
	const friendService = c.get('friendService');
	const userId = c.get('userId') as string;
	const friendshipId = c.req.param('friendshipId');

	// TODO: Handle this in zod middleware
	if (!friendshipId) {
		throw new BadRequestError('Validation error: Friendship ID is required');
	}

	try {
		const confirmedFriendship = await friendService.confirmFriendRequest(userId, friendshipId);

		return handleApiSuccess(c, confirmedFriendship, 'Friend request confirmed successfully');
	} catch (error) {
		return handleApiError(c, error);
	}
});

// Remove a friend from a user's friend list.
app.delete('/:friendshipId', async (c) => {
	// TODO: Add validation for the request body & params using Zod
	const friendService = c.get('friendService');
	const userId = c.get('userId') as string;
	const friendshipId = c.req.param('friendshipId');

	// TODO: Handle this in zod middleware
	if (!friendshipId) {
		throw new BadRequestError('Validation error:Friendship ID is required');
	}

	try {
		const removedFriendship = await friendService.removeFriend(userId, friendshipId);

		return handleApiSuccess(c, removedFriendship, 'Friend removed successfully');
	} catch (error) {
		return handleApiError(c, error);
	}
});

export default app;
