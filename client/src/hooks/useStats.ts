import { getRequest } from "@/utils/api";
import { UserAndFriendshipStats } from "@server/types";
import { useQuery } from "@tanstack/react-query";
// import { useState } from "react";

export const useStats = () => {
	async function loadStats() {
		const { data: stats } = await getRequest<UserAndFriendshipStats>("stats");

		return stats;
	}

	const result = useQuery({
		queryKey: ["stats"],
		queryFn: loadStats,
	});

	return result;
};
