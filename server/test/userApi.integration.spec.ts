import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { testApiFetch } from './utils/api';

//#region Helper functions
function createUser(createUserData: any) {
	const url = '/users';

	return testApiFetch(url, {
		method: 'POST',
		body: JSON.stringify(createUserData),
	});
}

/** Creates multiple fake users and returns their ids as an array */
function getUserToCreateByIndex(index: number) {
	return { username: `testuser${index}`, email: `test${index}@foo.com` };
}

async function createMultipleFakeUsers(numOfUsersToCreate: number): string[] {
	let usersToCreate = [];

	for (let i = 1; i <= numOfUsersToCreate; i++) {
		const userToCreate = getUserToCreateByIndex(i);
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

	const idsOfUsersCreated = usersCreated.map((user) => user.id);

	return idsOfUsersCreated;
}

function deleteUser(userId: string) {
	const url = `/users/${userId}`;

	return testApiFetch(url, { method: 'DELETE' });
}

function getUsers(urlSuffix = '') {
	const url = `/users${urlSuffix}`;

	return testApiFetch(url, { method: 'GET' });
}
//#endregion Helper functions

//#region Tests
describe('User API', () => {
	describe('User functionality', () => {
		describe('Create user', () => {
			let idsOfUsersCreated: string[] = [];

			describe('valid user information provided', () => {
				let userToCreate = {
					username: 'testuser',
					email: 'test@foo.com',
				};

				afterEach(async () => {
					// Delete all users created
					await Promise.all(idsOfUsersCreated.map(deleteUser));
				});

				it('should create a new user and return the created user', async () => {
					const response = await createUser(userToCreate);

					expect(response.status).toBe(201);
					const responseBody = (await response.json()) as any;

					// A user created in the db should have an id
					expect(responseBody.data.id).toBeDefined();

					// Add this to array for cleanup later
					idsOfUsersCreated.push(responseBody.data.id);

					expect(responseBody.data.username).toBe(userToCreate.username);
					expect(responseBody.data.email).toBe(userToCreate.email);
				});
			});

			describe('invalid user information provided', () => {
				let validEmail = 'foo@bar.com';
				let validUsername = 'validusername';

				// Missing username
				it('should fail if username is missing', async () => {
					const response = await createUser({ email: validEmail });
					expect(response.status).toBe(400);
				});

				// Missing email
				it('should fail if email is missing', async () => {
					const response = await createUser({ username: validUsername });
					expect(response.status).toBe(400);
				});

				// Invalid email
				it('should fail if email is invalid', async () => {
					const invalidEmail = 'invalid.email';

					const response = await createUser({ username: validUsername, email: invalidEmail });
					expect(response.status).toBe(400);
				});

				// Invalid username
				it('should fail if username is too short (<3 chars)', async () => {
					const shortUsername = 'aa';

					const response = await createUser({ username: shortUsername, email: validEmail });
					expect(response.status).toBe(400);
				});

				it('should fail if username is too long (>16 chars)', async () => {
					const longUsername = 'thisisaverylongon'; //17 chars

					const response = await createUser({ username: longUsername, email: validEmail });
					expect(response.status).toBe(400);
				});

				describe('records exist', () => {
					let userToCreate = {
						username: 'testuser',
						email: 'foo@bar.com',
					};

					let userCreatedId: string;

					// Create a user so we are certain that the user exists
					beforeAll(async () => {
						const userCreatedResponse = await createUser(userToCreate);

						const responseBody = (await userCreatedResponse.json()) as any;
						userCreatedId = responseBody.data.id;
					});

					afterAll(async () => {
						// Delete all users created
						await deleteUser(userCreatedId);
					});

					// Existing email
					it('should fail if email already exists', async () => {
						const response = await createUser({ username: 'nonexistent', email: userToCreate.email });
						expect(response.ok).toBe(false);
						expect(response.status).toBe(409); // Conflict
					});

					// Existing username
					it('should fail if username already exists', async () => {
						const response = await createUser({ username: userToCreate.username, email: 'nonexistent@example.com' });
						expect(response.ok).toBe(false);
						expect(response.status).toBe(409); // Conflict
					});
				});
			});
		});

		describe('Get all users', () => {
			const numOfUsersToCreate = 5;
			let idsOfUsersCreated: string[] = [];

			// Create some fake users to test that this is working
			beforeEach(async () => {
				idsOfUsersCreated = await createMultipleFakeUsers(numOfUsersToCreate);
			});

			afterEach(async () => {
				// Delete all users created
				await Promise.all(idsOfUsersCreated.map(deleteUser));
			});

			it('should return all users', async () => {
				const response = await getUsers();

				expect(response.status).toBe(200);
				const responseBody = (await response.json()) as any;
				expect(responseBody.data).toBeInstanceOf(Array);

				// Using greaterThanOrEqual because we might already have records in db -> until we create a testing only db (in which case we can wipe db with each run)
				expect(responseBody.data.length).toBeGreaterThanOrEqual(numOfUsersToCreate);

				// Validate each user object
				responseBody.data.forEach((userFound: any) => {
					//? We can add more fields to the validation on an as needed basis
					expect(userFound).toHaveProperty('username');
					expect(userFound).toHaveProperty('email');
					expect(userFound).toHaveProperty('id'); // Assuming each user has an id
				});
			});
		});

		describe('Pagination', () => {
			// Create some fake records to test that this is working
			const numOfUsersToCreate = 2;
			let idsOfUsersCreated: string[] = [];

			// Create some fake users to allow for pagination tests
			beforeEach(async () => {
				idsOfUsersCreated = await createMultipleFakeUsers(numOfUsersToCreate);
			});

			afterEach(async () => {
				// Delete all users created
				await Promise.all(idsOfUsersCreated.map(deleteUser));
			});

			it('should return the correct number of users when limit is specified', async () => {
				const limit = 1;
				const response = await getUsers(`?limit=${limit}`);
				expect(response.status).toBe(200);

				const responseBody = (await response.json()) as any;
				expect(responseBody.data).toHaveLength(limit);
			});

			it('should return the correct page of users when pagination is specified', async () => {
				// Running this test with limit of 1 because at the moment we are not guaranteed of order of creation for all records, which makes this trickier to test
				const limit = 1;
				const page = 2;

				// specify limit to control returned records (so we know what data to expect from page)
				const response = await getUsers(`?limit=${limit}&page=${page}`);
				expect(response.status).toBe(200);

				const responseBody = (await response.json()) as any;
				const actualFirstRecord = responseBody.data[0];
				const expectedFirstRecordId = idsOfUsersCreated[limit];

				expect(actualFirstRecord.id).toBe(expectedFirstRecordId);
			});
		});
	});
});
//#endregion
