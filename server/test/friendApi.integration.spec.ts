import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { testApiFetch } from './utils/api';
import { createMultipleFakeUsers, deleteUser } from './utils/testUtils';

//#region Helper functions
async function addFriend(userId: string, friendUserId: any) {
	const url = `/users/${userId}/friends`;
	const requestBody = JSON.stringify({ friendUserId });

	return testApiFetch(url, { method: 'POST', body: requestBody });
}

async function removeFriend(userId: string, friendshipId: string) {
	const url = `/users/${userId}/friends/${friendshipId}`;

	return testApiFetch(url, { method: 'DELETE' });
}

async function getUserFriendList(userId: string) {
	const url = `/users/${userId}/friends`;

	return testApiFetch(url, { method: 'GET' });
}

//#endregion Helper functions

//#region Tests
describe('Friend API', () => {
	let userId: string;
	let friendUserId: string;
	let idsOfUsersCreated: string[] = [];

	// Create the users we will simulate friendships between
	beforeAll(async () => {
		idsOfUsersCreated = await createMultipleFakeUsers(2);

		userId = idsOfUsersCreated[0];
		friendUserId = idsOfUsersCreated[1];
	});

	afterAll(async () => {
		// Delete all users created
		await Promise.all(idsOfUsersCreated.map(deleteUser));
	});

	describe('Add friend', () => {
		//? We are only testing with one pair of users for simplicity
		let friendshipId: string;

		afterEach(async () => {
			// Delete friendship created as a result of any test run
			if (friendshipId) {
				await removeFriend(userId, friendshipId);
			}
		});

		describe('Valid inputs', () => {
			it('should send a friend request to the user with friendUserId and return the created friendship', async () => {
				const addFriendResponse = await addFriend(userId, friendUserId);

				expect(addFriendResponse.status).toBe(201);

				const addFriendResponseBody = (await addFriendResponse.json()) as any;
				// A user created in the db should have an id
				expect(addFriendResponseBody.data.id).toBeDefined();

				//? Save the friendshipId for cleanup
				friendshipId = addFriendResponseBody.data.id;
			});
		});

		describe('Invalid inputs', () => {
			it('should fail if user tries to add themself as a friend', async () => {
				const addFriendResponse = await addFriend(userId, userId);

				expect(addFriendResponse.status).toBe(403); // Forbidden
			});

			it('should fail if user ID is invalid', async () => {
				const invalidUserId = 'badUserId';
				const addFriendResponse = await addFriend(invalidUserId, friendUserId);

				expect(addFriendResponse.status).toBe(400); // Bad request
			});

			it('should fail if friend user ID is invalid', async () => {
				const badFriendUserId = 'badFriendUserId';
				const addFriendResponse = await addFriend(userId, badFriendUserId);

				expect(addFriendResponse.status).toBe(400); // Bad request
			});

			it('should fail if friend user ID is missing', async () => {
				const addFriendResponse = await addFriend(userId, undefined);

				expect(addFriendResponse.status).toBe(400); // Bad request
			});

			it('should fail if users are already friends (or have existing pending request)', async () => {
				// First, add friend -> no need to assert, we already did that
				const addFriendResponse = await addFriend(userId, friendUserId);

				//? Save the friendshipId for cleanup after the test runs
				const addFriendResponseBody = (await addFriendResponse.json()) as any;
				friendshipId = addFriendResponseBody.data.id;

				// Second, try to add friend again
				const addFriendAgainResponse = await addFriend(userId, friendUserId);
				expect(addFriendAgainResponse.status).toBe(409); // Conflict
			});
		});
	});

	describe('Remove friend', () => {
		describe('Valid inputs', () => {
			it('should allow friendship initiator to remove friend as a friend', async () => {
				// TODO: Implement test
			});

			it('should allow friend to remove friendship initiator as a friend', async () => {
				// TODO: Implement test
			});

			it('should deduct the number of friends a user has', async () => {
				// TODO: Implement test
			});

			describe('users are already friends', () => {
				it('should decrement the friendCount for the current user by 1', () => {
					// TODO: Implement test
				});

				// This prevents us from incorrectly modifying the pendingFriendCount
				it('should maintain the same pendingFriendCount', () => {
					// TODO: Implement test
				});
			});

			describe('friend request is pending', () => {
				it('should decrement the pendingFriendCount for the current user by 1', () => {
					// TODO: Implement test
				});

				// This prevents us from incorrectly modifying the pendingFriendCount
				it('should maintain the same friendCount', () => {
					// TODO: Implement test
				});
			});
		});

		describe('Invalid inputs', () => {
			it('should fail if user ID is invalid', async () => {
				// TODO: Implement test
			});

			it('should fail if friend user ID is invalid', async () => {
				// TODO: Implement test
			});

			it('should fail if users are not friends', async () => {
				// TODO: Implement test
			});
		});
	});

	describe('Get user friend list', () => {
		describe('Valid inputs', () => {
			it('should return an empty list if user has no friends', async () => {
				// TODO: Implement test
			});

			it('should return an array containing friends if the user has friends', async () => {
				// TODO: Implement test
			});

			it("should include the friend's nickname in the user info, if set", async () => {
				// TODO: Implement test
			});

			describe('Pagination', () => {
				it('should return the correct number of friends when limit is specified', async () => {
					// TODO: Implement test
				});

				it('should return the correct page of friends when pagination is specified', async () => {
					// TODO: Implement test
				});

				it('should return an empty array when pagination page is out of bounds', () => {
					// TODO: Implement test
				});
			});
		});

		describe('Invalid inputs', () => {
			it('should fail if user ID is invalid', async () => {
				// TODO: Implement test
			});
		});
	});
});

//#endregion Tests
