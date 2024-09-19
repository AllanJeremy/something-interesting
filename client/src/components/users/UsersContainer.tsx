import { Card, CardContent, CardHeader } from "@/components/ui/card";
import WordRotate from "../magicui/word-rotate";
import UsersTable from "./_partials/UsersTable";
import { Button } from "../ui/button";
import CreateUserDialog from "./_partials/CreateUserDialog";

import { useState } from "react";

function UsersContainer() {
	const [_createUserDialogIsOpen, _setCreateUserDialogIsOpen] = useState(false);

	return (
		<>
			<CreateUserDialog
				open={_createUserDialogIsOpen}
				setOpen={_setCreateUserDialogIsOpen}
			/>
			<Card className="mb-12">
				<CardHeader>
					<section className="flex justify-between">
						<div className="flex items-center">
							<h2 className="mr-2 text-4xl font-bold text-black dark:text-white">
								Manage
							</h2>
							<WordRotate
								className="text-4xl font-bold text-black dark:text-white"
								words={["users", "friends", "friend requests"]}
							/>
						</div>

						<Button onClick={() => _setCreateUserDialogIsOpen(true)}>
							Create user
						</Button>
					</section>

					<p className="mt-4 text-lg font-light text-slate-700/80">
						Click on any user to view their friends. Toggle active user to
						determine which user you want to send friend requests as.
					</p>
					<p className="mt-4 text-sm font-light text-slate-700/80">
						In the real world, the active user would be the currently logged in
						user
					</p>
				</CardHeader>
				<CardContent>
					<UsersTable />
				</CardContent>
			</Card>
		</>
	);
}

export default UsersContainer;
