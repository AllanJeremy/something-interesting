import { users } from '../db/schema';
import { DatabaseConnection } from '../db';
import { CreateUserData, User } from '../types';
import { desc, eq, ilike } from 'drizzle-orm';
export class UserService {
	//#region Constants
	//* These values never change from instance to instance - so we make them static
	static MIN_USERNAME_CHARS = 3;
	static MAX_USERNAME_CHARS = 16; //? Should match `users.username` column max length in db
	static MAX_EMAIL_CHARS = 320; //? Should match `users.email` column max length in db

	static DEFAULT_USERS_PER_PAGE = 50;

	//#endregion Constants

	// We pass in the database to avoid creating multiple connections
	constructor(private db: DatabaseConnection) {}

	/**
	 * Checks if a user with a specific id exists in the database
	 * @description This method provides a performant way to verify the existence of a user
	 * without fetching all user data
	 * @param userId The id of the user to check for existence
	 * @returns {Promise<boolean>} A promise that resolves to `true` if the user exists, `false` otherwise
	 */
	public async userExists(userId: string): Promise<boolean> {
		// TODO: Debug this -> currently fails with db error when record is not found
		const userExists = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);

		return userExists.length > 0;
	}

	/**
	 * Creates a new user in the database
	 * @param createUserData The data for the user to create
	 * @returns {Promise<User>} A promise that resolves to the created user
	 */
	public async createUser(createUserData: CreateUserData): Promise<User> {
		const createdUser = await this.db
			.insert(users)
			.values({
				username: createUserData.username,
				email: createUserData.email,
			})
			.returning();

		return createdUser[0];
	}

	/**
	 * Retrieves a list of users from the database
	 * @param searchQuery An optional search query to filter users by username
	 * @param limit The number of users to retrieve per page
	 * @param offset The number of users to skip
	 * @returns {Promise<User[]>} A promise that resolves to an array of User objects
	 */
	public async getAllUsers(searchQuery: string | null = null, limit = UserService.DEFAULT_USERS_PER_PAGE, offset = 0): Promise<User[]> {
		// Only search by username while searching for users
		const searchCondition = searchQuery ? ilike(users.username, `%${searchQuery.toLowerCase()}%`) : undefined;

		//? We could optimize this by fetching less columns here
		const usersFound = await this.db.select().from(users).where(searchCondition).limit(limit).offset(offset).orderBy(desc(users.updatedAt));

		return usersFound;
	}
}
