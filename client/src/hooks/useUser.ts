import { useState } from "react";

export const useUser = () => {
	//
	const [users, _setUsers] = useState([]);
	const [usersAreLoading, _setUsersAreLoading] = useState(true);
	const [activeUser, setActiveUser] = useState(null);

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
