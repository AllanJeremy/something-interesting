import { getRequest } from "@/utils/api";
import { UserAndFriendshipStats } from "@server/types";
import { useQuery } from "@tanstack/react-query";

export const useStats = () => {
	async function loadStats() {
		const { data: stats } = await getRequest<UserAndFriendshipStats>("stats");

		return stats;
	}

	const statsQuery = useQuery({
		queryKey: ["stats"],
		queryFn: loadStats,
	});

	return { statsQuery };
};
