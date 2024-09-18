import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberTicker from "./magicui/number-ticker";
import { useStats } from "@/hooks";

function StatsCard() {
	const { stats } = useStats();
	const [averageFriendsPerUser, _setAverageFriendsPerUser] =
		useState<number>(0);

	useEffect(() => {
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
					Some of the cards (the fancy looking ones) can be clicked to view more
					details
				</p>
			</CardHeader>

			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-4xl font-bold">
								<NumberTicker value={stats.users.total} />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xl">Total users</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-4xl font-bold">
								<NumberTicker value={averageFriendsPerUser} />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xl">Average friends per user</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-4xl font-bold">
								<NumberTicker value={stats.friendships.total} />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xl">Total friendships</p>
						</CardContent>
					</Card>
				</div>
			</CardContent>
		</Card>
	);
}

export default StatsCard;
