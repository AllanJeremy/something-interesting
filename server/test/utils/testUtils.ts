//? Helper functions that may be used in multiple tests
import { assert } from 'vitest';
import { testApiFetch } from './api';

//#region User functions
export function createUser(createUserData: any) {
	const url = '/users';

	return testApiFetch(url, {
		method: 'POST',
		body: JSON.stringify(createUserData),
	});
}

/**
 * Creates multiple fake users for testing purposes.
 *
 * @param {number} numOfUsersToCreate - The number of users to create.
 * @param {string} [prefix='foo'] - The prefix to use for usernames and emails. This helps avoid name collisions when running tests in parallel.
 * @returns {Promise<string[]>} - A promise that resolves to an array of created user IDs.
 */
export async function createMultipleFakeUsers(numOfUsersToCreate: number, prefix = 'foo'): Promise<string[]> {
	const usersToCreate = [];

	for (let i = 1; i <= numOfUsersToCreate; i++) {
		const randomNumber = Math.floor(Math.random() * 1000000);
		const userToCreate = { username: `test${randomNumber}`, email: `test${randomNumber}@${prefix}.com` };
		usersToCreate.push(userToCreate);
	}

	// Create the users
	const usersCreatedResponses = await Promise.all(usersToCreate.map(createUser));

	const usersCreated = await Promise.all(
		usersCreatedResponses.map(async (response) => {
			const json = (await response.json()) as any;
			return json.data;
		})
	);

	assert(usersCreated.filter(Boolean).length === numOfUsersToCreate, 'Not all users were created! Try again');

	const idsOfUsersCreated = usersCreated.map((user) => user.id);

	return idsOfUsersCreated;
}

export function deleteUser(userId: string) {
	const url = `/users/${userId}`;

	return testApiFetch(url, { method: 'DELETE' });
}

export function getUsers(urlSuffix = '') {
	const url = `/users${urlSuffix}`;

	return testApiFetch(url, { method: 'GET' });
}

//#endregion User functions
