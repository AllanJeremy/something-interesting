import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { handleApiError } from '../utils/api.utils';

const _userIdSchema = z.object({
	userId: z.string().uuid(),
});

/**
 * Validates the userId parameter
 */
export const validateUserIdParam = zValidator('param', _userIdSchema, (result, c) => {
	if (!result.success) {
		return handleApiError(c, result.error);
	}
});
