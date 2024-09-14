import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { handleApiError } from '../utils/api.utils';

const _paginationSchema = z.object({
	search: z.string().optional(),
	limit: z.string().optional(),
	page: z.string().optional(),
});

/**
 * Validates the query parameters for pagination
 */
export const validatePaginationQuery = zValidator('query', _paginationSchema, (result, c) => {
	if (!result.success) {
		return handleApiError(c, result.error);
	}
});
