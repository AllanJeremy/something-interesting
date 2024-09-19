import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreateUserData } from "@server/types";
import { useUser } from "@/hooks";
import { Label } from "@/components/ui/label";

type CreateUserDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

const _INITIAL_CREATE_USER_DATA: CreateUserData = {
	username: "",
	email: "",
};

function CreateUserDialog({ open, setOpen }: CreateUserDialogProps) {
	const [_createUserData, _setCreateUserData] = useState<CreateUserData>(
		_INITIAL_CREATE_USER_DATA
	);
	const [_createUserDataIsComplete, _setCreateUserDataIsComplete] =
		useState(false);

	//#region Handlers
	function _resetCreateUserDataInputs() {
		_setCreateUserData(_INITIAL_CREATE_USER_DATA);
		setOpen(false);
	}

	function _handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		_setCreateUserData({ ..._createUserData, [name]: value });
	}
	//#endregion Handlers

	//#region Effects
	useEffect(
		function () {
			const isComplete = Boolean(
				_createUserData?.username && _createUserData?.email
			);

			_setCreateUserDataIsComplete(isComplete);
		},
		[_createUserData]
	);
	//#endregion Effects

	const { handleCreateUser, createUserMutation } = useUser(
		_resetCreateUserDataInputs
	);

	//? TODO: Consider using shadcn/ui <Form /> with Zod validation for this if the opportunity arises for stronger validations
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New User</DialogTitle>
					<DialogDescription>
						Fill in the details below to create a new user. All fields are
						required.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<Label htmlFor="username">Username</Label>
						<Input
							id="username"
							name="username"
							placeholder="some_ninja"
							value={_createUserData.username}
							onChange={_handleInputChange}
							required
						/>
					</div>
					<div>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="that.ninja@interesting.com"
							value={_createUserData.email}
							onChange={_handleInputChange}
							required
						/>
					</div>
				</div>
				<DialogFooter className="flex justify-between">
					<DialogClose asChild>
						<Button
							type="submit"
							variant="secondary"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
					</DialogClose>

					<Button
						type="button"
						onClick={() => handleCreateUser(_createUserData)}
						disabled={
							createUserMutation.isPending || !_createUserDataIsComplete
						}
					>
						{createUserMutation.isPending ? "Creating..." : "Create User"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default CreateUserDialog;
