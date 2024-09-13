import { users, userFriends, userFriendsRelations } from '../db/schema';
import { createDb } from '../db';
import { CreateUserData, CreateUserFriendData, User, UserFriendship } from '../types';
import { and, or, desc, eq, ilike, SQL } from 'drizzle-orm';
export class UserService {
	//#region Constants
	//* These values never change from instance to instance - so we make them static
	static MIN_USERNAME_CHARS = 3;
	static MAX_USERNAME_CHARS = 16; //? Should match `users.username` column max length in db
	static MAX_EMAIL_CHARS = 320; //? Should match `users.email` column max length in db

	static DEFAULT_USERS_PER_PAGE = 50;
	static DEFAULT_FRIENDS_PER_PAGE = 25;

	//#endregion Constants

	//#region Constructor
	// TODO: Consider making this a singleton when we have more services
	private db: ReturnType<typeof createDb>;

	constructor(private databaseUrl: string) {
		this.db = createDb(databaseUrl);
	}
	//#endregion Constructor

	/** A performant way to check if a user with a specific id exists
	 * @param userId The id of the user to check for existence
	 */
	private async _userExists(userId: string): Promise<boolean> {
		const userExists = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);

		return userExists.length > 0;
	}

	//#region Users
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

	//? Consider adding a search query param to this endpoint in future
	public async getAllUsers(searchQuery?: string, limit = UserService.DEFAULT_USERS_PER_PAGE, offset = 0): Promise<User[]> {
		// Only search by username while searching for users
		const searchCondition = searchQuery ? ilike(users.username, `%${searchQuery.toLowerCase()}%`) : undefined;

		//? We could optimize this by fetching less columns here
		const usersFound = await this.db.select().from(users).where(searchCondition).limit(limit).offset(offset).orderBy(desc(users.updatedAt));

		return usersFound;
	}
	//#endregion Users

	//#region Friends

	private _getUserInitiatedFriendRequestQuery(userId: string, friendUserId: string): SQL {
		return and(eq(userFriends.userId, userId), eq(userFriends.friendUserId, friendUserId)) as SQL;
	}

	private _getFriendInitiatedFriendRequestQuery(userId: string, friendUserId: string): SQL {
		return and(eq(userFriends.userId, friendUserId), eq(userFriends.friendUserId, userId)) as SQL;
	}

	/**
	 * Fetches the user friendship id between two users
	 * @description We only return the id because that's all we need
	 * @param userId The id of the user to check for friendship
	 * @param friendUserId The id of the friend to check for
	 * @returns The user friendship if it exists, `null` otherwise
	 */
	private async _getUserFriendship(
		userId: string,
		friendUserId: string,
		condition?: (userId: string, friendUserId: string) => SQL
	): Promise<UserFriendship | null> {
		let whereCondition: SQL;

		// If a condition is provided, use it
		if (condition) {
			whereCondition = condition(userId, friendUserId);
		} else {
			// Otherwise, use the default condition
			const userInitiatedCondition = this._getUserInitiatedFriendRequestQuery(userId, friendUserId);
			const friendInitiatedCondition = this._getFriendInitiatedFriendRequestQuery(userId, friendUserId);

			whereCondition = or(userInitiatedCondition, friendInitiatedCondition) as SQL;
		}

		const userFriendship = await this.db.select().from(userFriends).where(whereCondition).limit(1).prepare('get_user_friendship').execute();

		return userFriendship.length > 0 ? userFriendship[0] : null;
	}

	/**
	 * Checks if two users are friends
	 * @param userId The id of the user to check for friendship
	 * @param friendUserId The id of the friend to check for
	 * @returns `true` if the users are friends, `false` otherwise
	 */
	private async _usersAreFriends(userId: string, friendUserId: string): Promise<boolean> {
		const userFriendshipId = await this._getUserFriendship(userId, friendUserId);

		return userFriendshipId !== null;
	}

	/**
	 * Checks if both users exist
	 * @param userId The id of the user to check for existence
	 * @param friendUserId The user id of the friend to check for existence
	 * @returns `true` if both users exist, `false` otherwise
	 */
	private async _bothUserAndFriendExist(userId: string, friendUserId: string): Promise<boolean> {
		const userExists = await this._userExists(userId);
		const friendUserExists = await this._userExists(friendUserId);

		return userExists && friendUserExists;
	}

	/**
	 * Adds a friend request between two users
	 * @param userId The id of the user initiating the friend request
	 * @param friendUserId The id of the user receiving the friend request
	 * @returns The friend request that was created
	 */
	public async addFriend(userId: string, friendUserId: string): Promise<UserFriendship> {
		if (userId === friendUserId) {
			throw new Error('You cannot add yourself as a friend');
		}

		const bothUserAndFriendExist = await this._bothUserAndFriendExist(userId, friendUserId);

		// Both users must exist for the friend request to be sent
		if (!bothUserAndFriendExist) {
			throw new Error('One or both users (initiator or receiver) do not exist');
		}

		const usersAreFriends = await this._usersAreFriends(userId, friendUserId);

		if (usersAreFriends) {
			throw new Error('Users are already friends or there is an existing pending request');
		}

		//* Getting here means both users exist and are not friends
		const createUserFriendData: CreateUserFriendData = {
			userId,
			friendUserId,
		};

		// Send a friend request
		const createdFriendRequest = await this.db
			.insert(userFriends)
			.values(createUserFriendData)
			.returning()
			.prepare('create_friend_request')
			.execute();

		return createdFriendRequest[0];
	}

	/**
	 * Confirms a friend request between two users
	 * @param userId The id of the user initiating the friend request
	 * @param friendUserId The id of the user receiving the friend request
	 * @returns The friend request that was confirmed
	 */
	public async confirmFriendRequest(userId: string, friendUserId: string): Promise<UserFriendship> {
		const bothUserAndFriendExist = await this._bothUserAndFriendExist(userId, friendUserId);

		if (!bothUserAndFriendExist) {
			throw new Error('One or both users (initiator or receiver) do not exist');
		}

		// Specifically get the friend request received by the user ~
		const existingFriendInitiatedFriendship = await this._getUserFriendship(
			userId,
			friendUserId,
			this._getFriendInitiatedFriendRequestQuery
		);

		// A user can only confirm a friend request they have received ~ not one they have initiated
		if (!existingFriendInitiatedFriendship) {
			// A user can only confirm a friend request they have received ~ not one they have initiated
			throw new Error(
				'No pending friend request to confirm. Note: You can only confirm requests you have received, not ones you have initiated.'
			);
		}

		if (existingFriendInitiatedFriendship.isConfirmed) {
			throw new Error('Users are already friends.');
		}

		//* Getting here means the friend request exists and is still pending
		// Confirm the friend request...
		const updatedUserFriendshipResponse = await this.db
			.update(userFriends)
			.set({ isConfirmed: true })
			.where(eq(userFriends.id, existingFriendInitiatedFriendship.id))
			.returning()
			.prepare('confirm_friend_request')
			.execute();

		return updatedUserFriendshipResponse[0];
	}

	/**
	 * Removes a friend request between two users
	 * @param userId The id of the user that initiated the friend request
	 * @param friendUserId The id of the user receiving the friend request
	 * @returns The friend request that was removed
	 */
	public async removeFriend(userId: string, friendUserId: string): Promise<string> {
		const existingFriendship = await this._getUserFriendship(userId, friendUserId);

		if (!existingFriendship) {
			throw new Error('Users are not friends. No friend request to remove.');
		}

		//* Getting here means the friendship exists
		//? A user can remove a friend whether or not they are the one that initiated the friendship

		// Remove the friend request
		const deletedUserFriendship = await this.db
			.delete(userFriends)
			.where(eq(userFriends.id, existingFriendship.id))
			.returning()
			.prepare('remove_friend')
			.execute();

		return deletedUserFriendship[0].id;
	}

	public async getUserFriendList(userId: string, limit = UserService.DEFAULT_FRIENDS_PER_PAGE, offset = 0): Promise<UserFriendship[]> {
		// TODO: Check if the user exists
		// TODO: Fetch the friend list
		const userFriendships = await this.db.select().from(userFriends).where(eq(userFriends.userId, userId)).limit(limit).offset(offset);

		return userFriendships;
	}

	//#endregion Friends
}
