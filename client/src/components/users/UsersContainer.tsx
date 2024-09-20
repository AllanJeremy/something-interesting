import { Card, CardContent, CardHeader } from "@/components/ui/card";
import WordRotate from "../magicui/word-rotate";
import UsersTable from "./_partials/UsersTable";
import CreateUserDialog from "./_partials/CreateUserDialog";

import { useState } from "react";
import { RainbowButton } from "../magicui/rainbow-button";

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

						<RainbowButton onClick={() => _setCreateUserDialogIsOpen(true)}>
							Create user
						</RainbowButton>
					</section>

					<p className="mt-4 text-sm font-light text-slate-700/80">
						Currently, you can only create and view users. In the future, you
						will be able to view friends for each user and toggle the active
						user.
					</p>
					<p className="mt-4 text-sm font-light text-slate-700/80">
						In future, you'd also be able to navigate between different pages
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
