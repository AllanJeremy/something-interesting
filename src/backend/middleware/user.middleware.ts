import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { handleApiError } from '../utils/api.utils';

//#region Validations

const _createUserSchema = z.object({
	username: z.string().min(3).max(16),
	email: z.string().email(),
});

/**
 * Validates the request body of a user creation request
 */
export const validateCreateUser = zValidator('json', _createUserSchema, (result, c) => {
	if (!result.success) {
		return handleApiError(c, result.error);
	}
});

//#endregion Validations
