import ApiEndpointCard from "@/components/primitive/ApiEndpointCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	DialogHeader,
	DialogFooter,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from "@/components/ui/dialog";

import { UserStats } from "@server/types";

function StatsUsersEndpointsDialog({
	open,
	userStats,
	setOpen,
}: {
	open: boolean;
	userStats: UserStats;
	setOpen: (open: boolean) => void;
}) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>We have {userStats.total} total users</DialogTitle>
					<DialogDescription>
						We fetched this stat through this endpoint:{" "}
						<ApiEndpointCard
							className="mt-3"
							title="Get Stats"
							method="GET"
							endpoint="/stats"
						/>
					</DialogDescription>
					<DialogDescription>
						<h2 className="text-lg font-semibold mt-6 mb-2">
							User related endpoints
						</h2>

						<section className="space-y-4">
							<ApiEndpointCard
								title="Create User"
								description="This endpoint is used to create a new user in the system."
								method="POST"
								endpoint="/users"
							/>
							<ApiEndpointCard
								title="Get Users"
								description="This endpoint retrieves a list of all users in the system."
								method="GET"
								endpoint="/users"
							/>
						</section>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="sm:justify-start">
					<DialogClose asChild>
						<Button
							type="button"
							variant="secondary"
							onClick={() => setOpen(false)}
						>
							Got it, close this
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default StatsUsersEndpointsDialog;
