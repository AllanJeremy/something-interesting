import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { handleApiError } from '../utils/api.utils';
import { userFriends } from '../db/schema';

//#region Validations

// Add friend validation
const _addFriendSchema = z.object({
	friendUserId: z.string().uuid(),
});

/**
 * Validates the request body of an add friend request
 */
export const validateAddFriend = zValidator('json', _addFriendSchema, (result, c) => {
	if (!result.success) {
		return handleApiError(c, result.error);
	}
});

// Validate friendshipId param
const _friendshipIdSchema = z.object({
	friendshipId: z.string().uuid(),
});

/**
 * Validates the friendshipId parameter for confirm/remove friend requests
 */
export const validateFriendshipIdParam = zValidator('param', _friendshipIdSchema, (result, c) => {
	if (!result.success) {
		return handleApiError(c, result.error);
	}
});

//#endregion Validations
