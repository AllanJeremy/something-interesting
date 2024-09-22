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

export async function createMultipleFakeUsers(numOfUsersToCreate: number): Promise<string[]> {
	let usersToCreate = [];

	for (let i = 1; i <= numOfUsersToCreate; i++) {
		const userToCreate = { username: `testuser${i}`, email: `test${i}@foo.com` };
		usersToCreate.push(userToCreate);
	}

	// Create the users
	const usersCreatedResponses = await Promise.all(usersToCreate.map(createUser));

	const usersCreated = await Promise.all(
		usersCreatedResponses.map(async (response) => {
			const json = (await response.json()) as any;

			console.log('user created: ', json);
			return json.data;
		})
	);

	assert(usersCreated.filter(Boolean).length === numOfUsersToCreate, 'Not all users were created! Try again');

	console.log('fake users:', usersCreated);

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
