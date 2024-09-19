import ErrorCard from "@/components/primitive/ErrorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks";

function UsersTable() {
	const { userQuery } = useUser();

	if (userQuery.isLoading) {
		return <Skeleton />;
	}

	if (userQuery.isError || !userQuery.data) {
		return <ErrorCard error={new Error("bruh")} />;
	}

	return (
		<>
			<section>
				<h1> User data</h1>
				{userQuery.data.map((user) => (
					<code key={user.id}>
						<pre>
							id: {user.id} | @{user.username} | {user.email} created on{" "}
							{user.createdAt.toString()}
						</pre>
					</code>
				))}
			</section>
		</>
	);
}

export default UsersTable;
