import { users, userFriends, userFriendsRelations } from '../db/schema';
import { createDb } from '../db';
import { CreateUserData, User } from '../types';
import { desc } from 'drizzle-orm';
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
		//
		return true;
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
	public async getAllUsers(limit = UserService.DEFAULT_USERS_PER_PAGE, offset = 0): Promise<User[]> {
		//? We could optimize this by fetching less columns here
		const usersFound = await this.db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.updatedAt));

		return usersFound;
	}
	//#endregion Users

	//#region Friends
	public async addFriend(userId: string, friendUserId: string) {
		if (userId === friendUserId) {
			throw new Error('You cannot add yourself as a friend');
		}

		const userExists = await this._userExists(userId);
		const friendUserExists = await this._userExists(friendUserId);

		// Both users must exist for the friend request to be sent
		if (!userExists || !friendUserExists) {
			throw new Error('User or friend user does not exist');
		}

		// TODO: Check if users are already friends or there is an existing pending request

		// TODO: Send a friend request
	}

	public async confirmFriendRequest(userId: string, friendUserId: string) {
		// TODO: Check if the friend request is valid
		//TODO: Check if users are already friends
		//TODO: Check if there is an existing pending request
		// TODO: Confirm the friend request
	}

	public async removeFriend(userId: string, friendUserId: string) {
		// TODO: Check if the friend request is valid
		// TODO: Remove the friend request
	}

	public async getUserFriendList(userId: string, limit = UserService.DEFAULT_FRIENDS_PER_PAGE, offset = 0) {
		// TODO: Check if the user exists
		// TODO: Fetch the friend list
	}

	//#endregion Friends
}
