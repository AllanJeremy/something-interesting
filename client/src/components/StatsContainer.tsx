import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberTicker from "./magicui/number-ticker";
import { useStats } from "@/hooks";
import { Skeleton } from "./ui/skeleton";
import ErrorCard from "./primitive/ErrorCard";

//#region Helper components
const STATS_HEIGHT_CLASS = "h-48";

const StatsLoadingSkeleton = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			{[...Array(3)].map((_, i) => (
				<Skeleton
					key={`stat-skeleton-${i}`}
					className={`${STATS_HEIGHT_CLASS} rounded-xl`}
				/>
			))}
		</div>
	);
};

const StatCard = ({ title, value }: { title: string; value: number }) => {
	return (
		<Card className="h-48 shadow-none text-center flex flex-col justify-center">
			<CardHeader>
				<CardTitle className="text-7xl font-bold">
					<NumberTicker value={value} />
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text">{title}</p>
			</CardContent>
		</Card>
	);
};
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
		<Card className="mb-12">
			<CardHeader>
				<h3 className="text-2xl font-semibold mb-4">Stats</h3>

				<p className="mb-4">
					Warning: these stats may be more exciting than they sound.
				</p>
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
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<StatCard title="Total users" value={stats.users.total} />
							<StatCard
								title="Average friends per user"
								value={averageFriendsPerUser}
							/>
							<StatCard
								title="Total friendships"
								value={stats.friendships.total}
							/>
						</div>
					)
				}
			</CardContent>
		</Card>
	);
}

export default StatsContainer;
