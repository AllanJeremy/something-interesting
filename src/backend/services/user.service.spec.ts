import { describe, it, expect } from 'vitest';

import { UserService } from './user.service';

describe('UserService', () => {
	it('runs the test successfully', () => {
		expect(true).toBe(true);
	});

	describe.skip('User functionality', () => {
		//
		describe('Create user', () => {
			describe('valid user information provided', () => {
				it('should create a new user and return the created user', () => {
					// TODO: Implement test
				});

				it('should set default values for optional fields', () => {
					// TODO: Implement test
				});
			});

			describe('INVALID user information provided', () => {
				describe('email', () => {
					it('should fail if email is in an invalid format', () => {
						//TODO: Add implementation
					});

					it('should fail if email is already in use', () => {
						// TODO: Implement test for duplicate email scenario
					});

					it(`should fail if email exceeds ${UserService.MAX_EMAIL_CHARS} characters`, () => {
						//TODO: Add implementation
					});
				});

				describe('username', () => {
					it(`should fail if the username is less than ${UserService.MIN_USERNAME_CHARS} characters`, () => {
						//TODO: Add implementation
					});

					it(`should fail if the username is greater than ${UserService.MAX_USERNAME_CHARS} characters`, () => {
						//TODO: Add implementation
					});

					it('should fail if the username contains special characters', () => {
						//TODO: Add implementation
					});

					it('should fail if the username already exists', () => {
						//TODO: Add implementation
					});
				});

				describe('role', () => {
					it('should fail if an invalid role is provided', () => {
						//TODO: Add implementation
					});
				});
			});
		});

		//
		describe('Get all users', () => {
			it('should return an empty array if there are no users', () => {
				// TODO: Implement test
			});

			it('should return an array of users if they are found', () => {
				// TODO: Implement test
			});

			it('should return the correct total count of users', () => {
				// TODO: Implement test
			});
			it('should return users sorted by a specified field', () => {
				// TODO: Implement test
			});

			it('should allow filtering users based on certain criteria', () => {
				// TODO: Implement test
			});

			describe('Pagination', () => {
				it(`should return a maximum of ${UserService.DEFAULT_USERS_PER_PAGE} users if no limit is specified`, () => {
					// TODO: Implement test
				});

				it('should return the correct number of users when limit is specified', async () => {
					// TODO: Implement test
				});

				it('should return the correct page of users when pagination is specified', async () => {
					// TODO: Implement test
				});

				it('should fail when pagination page is out of bounds', () => {
					// TODO: Implement test
				});
			});
		});
	});
});
