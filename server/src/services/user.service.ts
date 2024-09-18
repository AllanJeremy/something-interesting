import { users } from '../db/schema';
import { DatabaseConnection } from '../db';
import { CreateUserData, User, UserStats } from '../types';
import { desc, eq, ilike, SQL, sql } from 'drizzle-orm';
import { calculateOffset } from '../utils/pagination.utils';
import { ConflictError } from '../utils/error.utils';

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
		const userExists = await this.db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
		return userExists.length > 0;
	}

	private async _userWithUsernameExists(username: string): Promise<boolean> {
		const userExists = await this.db.select({ username: users.username }).from(users).where(eq(users.username, username)).limit(1);
		return userExists.length > 0;
	}

	private async _userWithEmailExists(email: string): Promise<boolean> {
		const userExists = await this.db.select({ email: users.email }).from(users).where(eq(users.email, email)).limit(1);
		return userExists.length > 0;
	}

	/**
	 * Creates a new user in the database
	 * @param createUserData The data for the user to create
	 * @returns {Promise<User>} A promise that resolves to the created user
	 */
	public async createUser(createUserData: CreateUserData): Promise<User> {
		const userWithUsernameExists = await this._userWithUsernameExists(createUserData.username);
		const userWithEmailExists = await this._userWithEmailExists(createUserData.email);

		if (userWithUsernameExists) {
			throw new ConflictError(
				`User with username '${createUserData.username}' already exists`,
				'Attempted to create a user with a username that already exists. Please try a different username.'
			);
		}

		if (userWithEmailExists) {
			throw new ConflictError(
				`User with email '${createUserData.email}' already exists`,
				'Attempted to create a user with an email that already exists. Please try a different email.'
			);
		}

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
	 * @param page The page number for pagination (starting at 1)
	 * @returns {Promise<User[]>} A promise that resolves to an array of User objects
	 */
	public async getAllUsers(searchQuery: string | null = null, limit = UserService.DEFAULT_USERS_PER_PAGE, page = 1): Promise<User[]> {
		// Only search by username while searching for users
		const searchCondition = searchQuery ? ilike(users.username, `%${searchQuery.toLowerCase()}%`) : undefined;

		const offset = calculateOffset(page, limit);

		//? We could optimize this by fetching less columns here
		const usersFound = await this.db.select().from(users).where(searchCondition).limit(limit).offset(offset).orderBy(desc(users.updatedAt));

		return usersFound;
	}

	/**
	 * Updates the friend count or pending friend count for specified users.
	 * @param updateField - The field to update, either 'friendCount' or 'pendingFriendCount'.
	 * @param operation - The operation to perform, either 'increment' or 'decrement'.
	 * @param userIds - The IDs of the users to update.
	 * @returns A promise that resolves when the update is complete.
	 */
	private async updateUserCounts(
		updateField: 'friendCount' | 'pendingFriendCount',
		operation: 'increment' | 'decrement',
		...userIds: string[]
	): Promise<void> {
		console.log('userIds', userIds);
		let setValue: SQL<unknown>;

		if (operation === 'increment') {
			setValue = sql`${users[updateField]} + 1`;
		} else {
			setValue = sql`GREATEST(${users[updateField]} - 1, 0)`;
		}

		await this.db
			.update(users)
			.set({ [updateField]: setValue })
			// Update records for all of the userIds passed in as arguments
			.where(sql`${users.id} = ANY(${sql.raw(`ARRAY[${userIds.map((id) => `'${id}'`).join(', ')}]::uuid[]`)})`)
			.execute();
	}

	/**
	 * Increments the friend count for specified users.
	 * @param userIds - The IDs of the users whose friend count should be incremented.
	 * @returns A promise that resolves when the increment is complete.
	 */
	public async incrementFriendCount(...userIds: string[]): Promise<void> {
		await this.updateUserCounts('friendCount', 'increment', ...userIds);
	}

	/**
	 * Decrements the friend count for specified users.
	 * @param userIds - The IDs of the users whose friend count should be decremented.
	 * @returns A promise that resolves when the decrement is complete.
	 */
	public async decrementFriendCount(...userIds: string[]): Promise<void> {
		await this.updateUserCounts('friendCount', 'decrement', ...userIds);
	}

	/**
	 * Increments the pending friend count for specified users.
	 * @param userIds - The IDs of the users whose pending friend count should be incremented.
	 * @returns A promise that resolves when the increment is complete.
	 */
	public async incrementPendingFriendCount(...userIds: string[]): Promise<void> {
		await this.updateUserCounts('pendingFriendCount', 'increment', ...userIds);
	}

	/**
	 * Decrements the pending friend count for specified users.
	 * @param userIds - The IDs of the users whose pending friend count should be decremented.
	 * @returns A promise that resolves when the decrement is complete.
	 */
	public async decrementPendingFriendCount(...userIds: string[]): Promise<void> {
		await this.updateUserCounts('pendingFriendCount', 'decrement', ...userIds);
	}

	/**
	 * Get user stats
	 */
	public async getUserStats(): Promise<UserStats> {
		const totalUsersResponse = await this.db
			.select({ totalUsers: sql<string>`COUNT(id)` }) // sql will return numbers as strings by default
			.from(users)
			.prepare('count_total_users')
			.execute();

		const totalUsersFromResponse = totalUsersResponse[0].totalUsers || '0';

		return { total: parseInt(totalUsersFromResponse) };
	}
}
