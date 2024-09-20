import { getRequest } from "@/utils/api";
import { UserAndFriendshipStats } from "@server/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to manage statistics-related operations.
 * @returns {Object} - An object containing the stats query.
 */
export const useStats = () => {
	/**
	 * Makes the API request to load stats from the API.
	 * @returns {Promise<UserAndFriendshipStats>} - A promise that resolves to the user and friendship stats.
	 */
	async function _loadStats(): Promise<UserAndFriendshipStats> {
		const { data: stats } = await getRequest<UserAndFriendshipStats>("/stats");
		return stats;
	}

	const statsQuery = useQuery({
		queryKey: ["stats"],
		queryFn: _loadStats,
	});

	return { statsQuery };
};
