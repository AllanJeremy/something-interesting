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
					<DialogTitle>You have {userStats.total} users</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
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
