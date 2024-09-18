import { useState } from "react";

export const useStats = () => {
	//
	const [stats, _setStats] = useState({});
	const [statsAreLoading, _setStatsAreLoading] = useState(true);

	function loadStats() {
		// TODO: add implementation
		_setStats({});
		_setStatsAreLoading(false);
	}

	return { loadStats, stats, statsAreLoading };
};
