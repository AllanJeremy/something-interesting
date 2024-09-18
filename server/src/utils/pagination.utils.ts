/**
 * Calculates the offset for pagination based on the page number and limit
 * @description This function is used to determine the starting point for fetching a specific page of results
 * @param page The current page number (1-indexed)
 * @param limit The number of items per page
 * @returns {number} The calculated offset
 */
export function calculateOffset(page: number, limit: number): number {
	const offset = (page - 1) * limit;

	return offset;
}
