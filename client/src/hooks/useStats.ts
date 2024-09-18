import { UserAndFriendshipStats } from "@server/types";
import { useState } from "react";

export const useStats = () => {
	//
	const [stats, _setStats] = useState<UserAndFriendshipStats>({
		users: {
			total: 10, //TODO: Get these from the endpoint
		},
		friendships: {
			total: 50, //TODO: Get these from the endpoint
		},
	});
	const [statsAreLoading, _setStatsAreLoading] = useState(true);

	function loadStats() {
		// TODO: add implementation
		_setStats(stats);
		_setStatsAreLoading(false);
	}

	return { loadStats, stats, statsAreLoading };
};
