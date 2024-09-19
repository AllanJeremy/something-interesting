import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberTicker from "./magicui/number-ticker";
import { useStats } from "@/hooks";
import { Skeleton } from "./ui/skeleton";
import ErrorCard from "./primitive/ErrorCard";
import { cn } from "@/lib/utils";
import WordRotate from "./magicui/word-rotate";

//#region Helper components
const STATS_HEIGHT_CLASS = "h-64";

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

const StatCard = ({
	title,
	value,
	imgUrl,
}: {
	title: string;
	value: number;
	imgUrl: string;
}) => {
	return (
		<Card
			className={cn(
				STATS_HEIGHT_CLASS,
				"shadow-none text-center flex flex-col justify-center relative"
			)}
		>
			{/* Background */}
			<div>
				<img
					src={imgUrl}
					alt="Background"
					className="absolute top-0 left-0 w-full h-full object-cover rounded-xl object-center"
				/>
				<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 rounded-xl"></div>
			</div>

			<CardHeader className="relative p-2">
				<CardTitle className="text-7xl font-bold text-white">
					<NumberTicker className="text-white" value={value} />
				</CardTitle>
			</CardHeader>
			<CardContent className="relative">
				<p className="text-white uppercase text-sm">{title}</p>
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
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<StatCard
								title="Total users"
								value={stats.users.total}
								imgUrl="/backgrounds/doge-pink.jpg"
							/>
							<StatCard
								title="Average friends per user"
								value={averageFriendsPerUser}
								imgUrl="/backgrounds/doge-standing.jpg"
							/>
							<StatCard
								title="Total friendships"
								value={stats.friendships.total}
								imgUrl="/backgrounds/doge-trio.jpg"
							/>
						</div>
					)
				}
			</CardContent>
		</Card>
	);
}

export default StatsContainer;
