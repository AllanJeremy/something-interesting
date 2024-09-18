import { useState } from "react";

export const useFriend = () => {
	const [userFriends, _setUserFriends] = useState([]);
	const [userFriendsAreLoading, _setUserFriendsAreLoading] = useState(true);

	// Add a friend to a user's friend list.
	function addFriend(userId: string, friendUserId: string) {
		// TODO: Add implementation
		_setUserFriends([]);
		_setUserFriendsAreLoading(false);
	}

	// Retrieve a list of all friends for a given user.
	function getUserFriends(userId: string) {
		// TODO: Add implementation
	}

	// Confirm a friend request
	function confirmFriendRequest(userId: string, friendshipId: string) {
		// TODO: Add implementation
	}

	// Remove a friend from a user's friend list.
	function removeFriend(userId: string, friendshipId: string) {
		// TODO: Add implementation
	}

	return {
		// Functions
		addFriend,
		getUserFriends,
		confirmFriendRequest,
		removeFriend,

		// Variables
		userFriends,
		userFriendsAreLoading,
	};
};
