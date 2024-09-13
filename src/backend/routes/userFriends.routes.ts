import { Hono } from 'hono';
import { Env, Vars } from '../backend.routes';
import { generateApiErrorResponse, generateApiSuccessResponse } from '../utils/api.utils';
import { FriendService } from '../services/friend.service';

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

// Add a friend to a user's friend list.
app.post('/', async (c) => {
	const friendService = c.get('friendService');
	const userId = c.get('userId') as string;

	const body = await c.req.json();
	const friendUserId = body.friendUserId; // TODO: Add validation for the request body using Zod

	if (!friendUserId) {
		const apiErrorResponse = generateApiErrorResponse('Friend user ID is required', 'Validation error');

		return c.json(apiErrorResponse, 400);
	}

	try {
		const createdFriendship = await friendService.addFriend(userId, friendUserId);
		const apiResponse = generateApiSuccessResponse(createdFriendship, 'Friend request sent successfully');

		return c.json(apiResponse, 201);
	} catch (error) {
		console.error('Error sending friend request: ', error);

		const apiErrorResponse = generateApiErrorResponse(error, 'Failed to send friend request');

		return c.json(apiErrorResponse, 500); // TODO: Handle different types of errors with specific status codes
	}
});

// Retrieve a list of all friends for a given user.
app.get('/', async (c) => {
	const friendService = c.get('friendService');
	const userId = c.get('userId') as string;

	// Get query parameters with default values
	const limit = parseInt(c.req.query('limit') || String(FriendService.DEFAULT_FRIENDS_PER_PAGE));
	const offset = parseInt(c.req.query('offset') || '0');

	try {
		const friendList = await friendService.getUserFriendList(userId, limit, offset);
		const apiResponse = generateApiSuccessResponse(friendList, 'Friend list retrieved successfully');

		return c.json(apiResponse);
	} catch (error) {
		console.error('Error retrieving friend list: ', error);
		const apiErrorResponse = generateApiErrorResponse(error, 'Failed to retrieve friend list');

		return c.json(apiErrorResponse);
	}
});

// Confirm a friend request
app.patch('/:friendshipId', async (c) => {
	const friendService = c.get('friendService');
	const userId = c.get('userId') as string;
	const friendshipId = c.req.param('friendshipId');

	if (!friendshipId) {
		const apiErrorResponse = generateApiErrorResponse('Friendship ID is required', 'Validation error');

		return c.json(apiErrorResponse, 400);
	}

	try {
		const confirmedFriendship = await friendService.confirmFriendRequest(userId, friendshipId);
		const apiResponse = generateApiSuccessResponse(confirmedFriendship, 'Friend request confirmed successfully');

		return c.json(apiResponse);
	} catch (error) {
		console.error('Error confirming friend request: ', error);
		const apiErrorResponse = generateApiErrorResponse(error, 'Failed to confirm friend request');

		return c.json(apiErrorResponse);
	}
});

// Remove a friend from a user's friend list.
app.delete('/:friendshipId', async (c) => {
	// TODO: Add validation for the request body & params using Zod
	const friendService = c.get('friendService');
	const userId = c.get('userId') as string;
	const friendshipId = c.req.param('friendshipId');

	console.debug('friendshipId: ', friendshipId);
	if (!friendshipId) {
		const apiErrorResponse = generateApiErrorResponse('Friendship ID is required', 'Validation error');
		return c.json(apiErrorResponse, 400);
	}

	try {
		const removedFriendship = await friendService.removeFriend(userId, friendshipId);
		const apiResponse = generateApiSuccessResponse(removedFriendship, 'Friend removed successfully');

		return c.json(apiResponse);
	} catch (error) {
		console.error('Error removing friend: ', error);
		const apiErrorResponse = generateApiErrorResponse(error, 'Failed to remove friend');

		return c.json(apiErrorResponse);
	}
});

export default app;
