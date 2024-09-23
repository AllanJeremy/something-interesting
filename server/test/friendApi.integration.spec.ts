import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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

async function getUserFriendList(userId: string, urlSuffix = '') {
	const url = `/users/${userId}/friends${urlSuffix}`;

	return testApiFetch(url, { method: 'GET' });
}

//#endregion Helper functions

//#region Tests
describe('Friend API', () => {
	let userId: string;
	let friendUserId: string;
	let idsOfUsersCreated: string[] = [];

	// Create the users we will simulate friendships between
	beforeEach(async () => {
		idsOfUsersCreated = await createMultipleFakeUsers(3, 'bar');

		userId = idsOfUsersCreated[0];
		friendUserId = idsOfUsersCreated[1];
	});

	afterEach(async () => {
		// Delete all users created for these tests
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
				const response = await addFriend(invalidUserId, friendUserId);

				expect(response.status).toBe(400); // Bad request
			});

			it('should fail if friend user ID is invalid', async () => {
				const badFriendUserId = 'badFriendUserId';
				const response = await addFriend(userId, badFriendUserId);

				expect(response.status).toBe(400); // Bad request
			});

			it('should fail if friend user ID is missing', async () => {
				const response = await addFriend(userId, undefined);

				expect(response.status).toBe(400); // Bad request
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
		let friendshipId: string;

		beforeEach(async () => {
			// Add one friend for the test then remove them -> no need to validate it works, we already did that in other tests
			const addFriendResponse = await addFriend(userId, friendUserId);
			friendshipId = ((await addFriendResponse.json()) as any).data.id;
		});

		afterEach(async () => {
			// Delete friendship created as a result of any test run
			if (friendshipId) {
				await removeFriend(userId, friendshipId);
			}
		});

		describe('Valid inputs', () => {
			it('should allow friendship initiator to remove friend as a friend', async () => {
				const response = await removeFriend(userId, friendshipId);

				expect(response.status).toBe(200);
			});

			it('should allow friend to remove friendship initiator as a friend', async () => {
				const response = await removeFriend(friendUserId, friendshipId);

				expect(response.status).toBe(200);
			});
		});

		describe('Invalid inputs', () => {
			it('should fail if user ID is invalid', async () => {
				const invalidUserId = 'invalidUserId';
				const response = await removeFriend(invalidUserId, friendshipId);

				expect(response.status).toBe(400); // Bad request
			});

			it('should fail if friendshipId is invalid', async () => {
				const invalidFriendshipId = 'invalidFriendUserId';
				const response = await removeFriend(userId, invalidFriendshipId);

				expect(response.status).toBe(400); // Bad request
			});

			it('should fail if users are not friends or have no pending request', async () => {
				const userIdWithNoFriends = idsOfUsersCreated[2];
				const response = await removeFriend(userIdWithNoFriends, friendshipId);

				expect(response.status).toBe(404); // Not found
			});
		});
	});

	describe('Get user friend list & pending requests', () => {
		describe('Valid inputs', () => {
			let friendshipId: string;

			afterEach(async () => {
				// Delete friendship created as a result of any test run
				if (friendshipId) {
					await removeFriend(userId, friendshipId);
				}
			});

			it('should return an empty array if user has no friends/requests', async () => {
				const response = await getUserFriendList(userId);
				expect(response.status).toBe(200);

				const responseBody = (await response.json()) as any;
				expect(responseBody.data).toHaveLength(0);
			});

			it('should return an array containing friends if the user has friends/requests', async () => {
				// Add one friend for the test then remove them -> no need to validate it works, we already did that in other tests
				const addFriendResponse = await addFriend(userId, friendUserId);
				friendshipId = ((await addFriendResponse.json()) as any).data.id;

				const response = await getUserFriendList(userId);
				expect(response.status).toBe(200);

				const responseBody = (await response.json()) as any;
				expect(responseBody.data).toHaveLength(1);

				expect(responseBody.data[0].id).toBe(friendshipId);
			});

			describe('Pagination', () => {
				let idsOfFriendshipsCreated: string[] = [];

				// Create some fake users to allow for pagination tests
				beforeEach(async () => {
					// Create 2 friendships, so we can test out pagination
					const friendshipsCreatedResponses = await Promise.all([addFriend(userId, friendUserId), addFriend(userId, idsOfUsersCreated[2])]);

					const friendshipsCreated = await Promise.all(
						friendshipsCreatedResponses.map(async (response) => {
							const json = (await response.json()) as any;
							return json.data;
						})
					);

					idsOfFriendshipsCreated = friendshipsCreated.map((friendship) => friendship.id);
				});

				afterEach(async () => {
					// Delete all users created
					await Promise.all(idsOfFriendshipsCreated.map((friendshipId) => removeFriend(userId, friendshipId)));
				});

				it('should return the correct number of friends/requests when limit is specified', async () => {
					const limit = 1;
					const response = await getUserFriendList(userId, `?limit=${limit}`);
					expect(response.status).toBe(200);

					const responseBody = (await response.json()) as any;
					expect(responseBody.data).toHaveLength(limit);
				});

				it('should return the correct page of friends/requests when pagination is specified', async () => {
					// We first fetch without a limit so we know where the record will be cut off (since we can't predict order of insertions)
					const responseBeforeLimit = await getUserFriendList(userId);
					const responseBodyBeforeLimit = (await responseBeforeLimit.json()) as any;

					// Running this test with limit of 1 because at the moment we are not guaranteed of order of creation for all records, which makes this trickier to test
					const limit = 1;
					const page = 2;

					// specify limit to control returned records (so we know what data to expect from page)
					const responseAfterLimit = await getUserFriendList(userId, `?limit=${limit}&page=${page}`);
					expect(responseAfterLimit.status).toBe(200);

					const responseBody = (await responseAfterLimit.json()) as any;
					const actualFirstRecord = responseBody.data[0];

					const expectedRecordIndex = page * limit - 1; // -1 because we start at 0
					const expectedFirstRecordId = responseBodyBeforeLimit.data[expectedRecordIndex].id;

					expect(actualFirstRecord.id).toBe(expectedFirstRecordId);
				});

				it('should return an empty array when pagination page is out of bounds', async () => {
					const page = 5000;

					// specify limit to control returned records (so we know what data to expect from page)
					const response = await getUserFriendList(userId, `?page=${page}`);
					expect(response.status).toBe(200);

					const responseBody = (await response.json()) as any;
					expect(responseBody.data).toHaveLength(0);
				});
			});
		});
	});

	describe('Invalid inputs', () => {
		it('should fail if user ID is invalid', async () => {
			const invalidUserId = 'invalidUserId';

			const getUserFriendListResponse = await getUserFriendList(invalidUserId);
			expect(getUserFriendListResponse.status).toBe(400); // Bad request
		});
	});
});

//#endregion Tests
