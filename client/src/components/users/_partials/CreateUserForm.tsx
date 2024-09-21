import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateUserData } from "@server/types";
import { useUser } from "@/hooks";
import { Label } from "@/components/ui/label";

const _INITIAL_CREATE_USER_DATA: CreateUserData = {
	username: "",
	email: "",
};

type CreateUserFormProps = {
	onSuccess?: () => void;
	onCancel?: () => void;
};

function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
	const [_createUserData, _setCreateUserData] = useState<CreateUserData>(
		_INITIAL_CREATE_USER_DATA
	);
	const [_createUserDataIsComplete, _setCreateUserDataIsComplete] =
		useState(false);

	//#region Handlers
	function _resetCreateUserDataInputs() {
		_setCreateUserData(_INITIAL_CREATE_USER_DATA);

		if (onSuccess) {
			onSuccess();
		}
	}

	function _handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		_setCreateUserData({ ..._createUserData, [name]: value });
	}

	function _handleCreateUser() {
		createUserMutation.mutate(_createUserData);
	}
	//#endregion Handlers

	//#region Effects
	// TODO: Add actual validations with Zod
	useEffect(() => {
		const isComplete = Boolean(
			_createUserData?.username &&
				_createUserData?.email &&
				_createUserData?.email.length > 4
		);

		_setCreateUserDataIsComplete(isComplete);
	}, [_createUserData]);
	//#endregion Effects

	const { createUserMutation } = useUser(_resetCreateUserDataInputs);

	return (
		<form>
			<section className="space-y-4">
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
			</section>

			<section className="mt-6 space-x-4 flex justify-between">
				<Button
					type="submit"
					variant="secondary"
					onClick={() => onCancel && onCancel()}
				>
					Cancel
				</Button>

				<Button
					type="button"
					onClick={_handleCreateUser}
					disabled={createUserMutation.isPending || !_createUserDataIsComplete}
				>
					{createUserMutation.isPending
						? "Creating..."
						: _createUserDataIsComplete
						? "Create User"
						: "Incomplete Data"}
				</Button>
			</section>
		</form>
	);
}

export default CreateUserForm;
