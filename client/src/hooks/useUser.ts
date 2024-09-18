import { useState } from "react";
import { type User } from "@server/types";

export const useUser = () => {
	//
	const [users, _setUsers] = useState<User[]>([]);
	const [usersAreLoading, _setUsersAreLoading] = useState(true);
	const [activeUser, setActiveUser] = useState<User | null>(null);

	function loadUsers() {
		// TODO: add implementation
		_setUsersAreLoading(false);
		_setUsers([]);
	}

	function resetActiveUser() {
		setActiveUser(null);
	}

	return {
		// Functions
		loadUsers,
		setActiveUser,
		resetActiveUser,

		// Variables
		activeUser,
		users,
		usersAreLoading,
	};
};
