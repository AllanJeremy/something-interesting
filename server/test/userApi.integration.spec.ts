import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { deleteUser, createUser, createMultipleFakeUsers, getUsers } from './utils/testUtils';

//#region Tests
describe.only('User API', () => {
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

					expect(response.status).toBe(201); // Created
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
					expect(response.status).toBe(400); // Bad request
				});

				// Missing email
				it('should fail if email is missing', async () => {
					const response = await createUser({ username: validUsername });
					expect(response.status).toBe(400); // Bad request
				});

				// Invalid email
				it('should fail if email is invalid', async () => {
					const invalidEmail = 'invalid.email';

					const response = await createUser({ username: validUsername, email: invalidEmail });
					expect(response.status).toBe(400); // Bad request
				});

				// Invalid username
				it('should fail if username is too short (<3 chars)', async () => {
					const shortUsername = 'aa';

					const response = await createUser({ username: shortUsername, email: validEmail });
					expect(response.status).toBe(400); // Bad request
				});

				it('should fail if username is too long (>16 chars)', async () => {
					const longUsername = 'thisisaverylongon'; //17 chars

					const response = await createUser({ username: longUsername, email: validEmail });
					expect(response.status).toBe(400); // Bad request
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
				// We first fetch without a limit so we know where the record will be cut off (since we can't predict order of insertions)
				const responseBeforeLimit = await getUsers();
				const responseBodyBeforeLimit = (await responseBeforeLimit.json()) as any;

				// Running this test with limit of 1 because at the moment we are not guaranteed of order of creation for all records, which makes this trickier to test
				const limit = 1;
				const page = 2;

				// specify limit to control returned records (so we know what data to expect from page)
				const responseAfterLimit = await getUsers(`?limit=${limit}&page=${page}`);
				expect(responseAfterLimit.status).toBe(200);

				const responseBodyAfterLimit = (await responseAfterLimit.json()) as any;
				const actualFirstRecord = responseBodyAfterLimit.data[0];

				const expectedRecordIndex = page * limit - 1; // -1 because we start at 0
				const expectedFirstRecordId = responseBodyBeforeLimit.data[expectedRecordIndex].id;

				expect(actualFirstRecord.id).toBe(expectedFirstRecordId);
			});

			it('should return an empty array when pagination is out of bounds', async () => {
				const page = 5000;

				// specify limit to control returned records (so we know what data to expect from page)
				const response = await getUsers(`?page=${page}`);
				expect(response.status).toBe(200);

				const responseBody = (await response.json()) as any;
				expect(responseBody.data).toHaveLength(0);
			});
		});
	});
});
//#endregion
