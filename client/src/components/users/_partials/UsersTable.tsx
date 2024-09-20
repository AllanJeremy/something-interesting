import ErrorCard from "@/components/primitive/ErrorCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Table,
} from "@/components/ui/table";
import { useUser } from "@/hooks";

function UsersTable() {
	const { userQuery } = useUser();
	const { data: users } = userQuery;

	if (userQuery.isLoading) {
		return <Skeleton />;
	}

	if (userQuery.isError || !users) {
		return <ErrorCard error={new Error("bruh")} />;
	}

	if (users.length === 0) {
		return (
			<Alert>
				<AlertTitle>No Users Found</AlertTitle>
				<AlertDescription>
					<p className="text-sm text-muted-foreground">
						There are currently no users available. But you can create some with
						that sparkly button up there.
					</p>
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="rounded-md border">
			<Table className="px-8">
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Username</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Friends</TableHead>
						<TableHead>Pending</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow>
							<TableCell>{user.id}</TableCell>
							<TableCell>{user.username}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.friendCount.toLocaleString()}</TableCell>
							<TableCell>{user.pendingFriendCount.toLocaleString()}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export default UsersTable;
