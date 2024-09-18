import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function ApiCard() {
	return (
		<Card className="mb-12">
			<CardHeader>
				<h3 className="text-2xl font-semibold mb-4">API</h3>

				<p className="mb-4">A sandbox environment for you to test out the different API endpoints</p>
			</CardHeader>
			<CardContent>
				<section>
					<h3>Users</h3>
				</section>
				<section>
					<h3>Friends</h3>
				</section>
			</CardContent>
		</Card>
	);
}

export default ApiCard;
