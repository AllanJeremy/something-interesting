import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStats } from "@/hooks";
import ErrorCard from "../primitive/ErrorCard";
import { cn } from "@/lib/utils";
import WordRotate from "../magicui/word-rotate";
import StatCard from "./_partials/StatCard";
import StatsFriendshipEndpointsDialog from "./_partials/StatsFriendshipEndpointsDialog";
import StatsLoadingSkeleton from "./_partials/StatsLoadingSkeleton";
import StatsUsersEndpointsDialog from "./_partials/StatsUsersEndpointsDialog";

//#region Dialogs

//#endregion Dialogs

//#region Helper components
const STATS_HEIGHT_CLASS = "h-64";
const STATS_GAP_CLASS = "gap-6";

//#endregion Helper components

//#region Stats Container
function StatsContainer() {
	const {
		data: stats,
		isLoading: statsAreLoading,
		isError: statsHaveError,
		error,
		isPending: statsArePending,
		isSuccess: statsSuccessfullyLoaded,
	} = useStats();
	const [averageFriendsPerUser, _setAverageFriendsPerUser] =
		useState<number>(0);

	const [userStatsDialogIsOpen, _setUserStatsDialogIsOpen] = useState(false);
	const [friendshipStatsDialogIsOpen, _setFriendshipStatsDialogIsOpen] =
		useState(false);

	//
	useEffect(() => {
		if (!stats) return;

		// Only attempt calculating the average if there are both users and friendships
		if (stats.users.total > 0 && stats.friendships.total > 0) {
			_setAverageFriendsPerUser(stats.friendships.total / stats.users.total);
		} else {
			_setAverageFriendsPerUser(0);
		}
	}, [stats]);

	return (
		<>
			{statsSuccessfullyLoaded && (
				<>
					<StatsUsersEndpointsDialog
						open={userStatsDialogIsOpen}
						userStats={stats.users}
						setOpen={_setUserStatsDialogIsOpen}
					/>
					<StatsFriendshipEndpointsDialog
						open={friendshipStatsDialogIsOpen}
						friendshipStats={stats.friendships}
						setOpen={_setFriendshipStatsDialogIsOpen}
					/>
				</>
			)}

			<Card className="mb-12">
				<CardHeader>
					<WordRotate
						className="text-4xl font-bold text-black dark:text-white"
						words={["Stats", "Insights", "Analytics"]}
					/>
				</CardHeader>
				<CardContent>
					{
						// Handle loading
						(statsAreLoading || statsArePending) && <StatsLoadingSkeleton />
					}
					{
						// Handle errors
						statsHaveError && <ErrorCard error={error} />
					}
					{
						// Display stats
						statsSuccessfullyLoaded && (
							<div
								className={cn(
									"grid grid-cols-1 md:grid-cols-3",
									STATS_GAP_CLASS
								)}
							>
								<StatCard
									className={STATS_HEIGHT_CLASS}
									title="Total users"
									value={stats.users.total}
									imgUrl="/backgrounds/doge-pink.jpg"
									onClick={() => _setUserStatsDialogIsOpen(true)}
								/>
								<StatCard
									className={STATS_HEIGHT_CLASS}
									title="Average friends per user"
									value={averageFriendsPerUser}
									imgUrl="/backgrounds/doge-standing.jpg"
									onClick={() => _setFriendshipStatsDialogIsOpen(true)}
								/>
								<StatCard
									className={STATS_HEIGHT_CLASS}
									title="Total friendships"
									value={stats.friendships.total}
									imgUrl="/backgrounds/doge-trio.jpg"
									onClick={() => _setFriendshipStatsDialogIsOpen(true)}
								/>
							</div>
						)
					}
				</CardContent>
			</Card>
		</>
	);
}

export default StatsContainer;
