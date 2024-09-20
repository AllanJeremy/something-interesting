import ApiEndpointCard from "@/components/primitive/ApiEndpointCard";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { UserFriendshipStats } from "@server/types";

function StatsFriendshipEndpointsDialog({
	open,
	friendshipStats,
	setOpen,
}: {
	open: boolean;
	friendshipStats: UserFriendshipStats;
	setOpen: (open: boolean) => void;
}) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{friendshipStats.total} friendships. Avg{" "}
						{friendshipStats.averageFriendshipsPerUser.toLocaleString()}/ user
					</DialogTitle>
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
							Friendship related endpoints
						</h2>

						<section className="space-y-4">
							<ApiEndpointCard
								title="Add Friend"
								description="This endpoint is used to add a new friend to the user's friend list."
								method="POST"
								endpoint="/:userId/friends"
							/>
							<ApiEndpointCard
								title="Get Friends"
								description="This endpoint retrieves a list of all friends for a given user."
								method="GET"
								endpoint="/:userId/friends"
							/>
							<ApiEndpointCard
								title="Confirm Friend Request"
								description="This endpoint confirms a friend request."
								method="PATCH"
								endpoint="/:userId/friends/:friendshipId"
							/>
							<ApiEndpointCard
								title="Remove Friend"
								description="This endpoint removes a friend from the user's friend list."
								method="DELETE"
								endpoint="/:userId/friends/:friendshipId"
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

export default StatsFriendshipEndpointsDialog;
