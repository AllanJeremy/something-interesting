import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NumberTicker from './magicui/number-ticker';

function StatsCard() {
	return (
		<Card className="mb-12">
			<CardHeader>
				<h3 className="text-2xl font-semibold mb-4">Stats</h3>

				<p className="mb-4">Some of the cards (the fancy looking ones) can be clicked to view more details</p>
			</CardHeader>

			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-4xl font-bold">
								<NumberTicker value={1000} />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xl">Total users</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-4xl font-bold">
								<NumberTicker value={794} />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xl">Average friends per user</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-4xl font-bold">
								<NumberTicker value={121461200} />
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
