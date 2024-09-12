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

	public async getAllUsers(searchQuery?: string, limit = UserService.DEFAULT_USERS_PER_PAGE, offset = 0): Promise<User[]> {
		const usersFound = await this.db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.updatedAt));

		return usersFound;
	}
	//#endregion Users

	//#region Friends
	public async addFriend(userId: string, friendUserId: string) {
		//
	}

	public async confirmFriendRequest(userId: string, friendUserId: string) {
		//
	}

	public async removeFriend(userId: string, friendUserId: string) {
		//
	}

	public async getUserFriendList(userId: string, limit = UserService.DEFAULT_FRIENDS_PER_PAGE, offset = 0) {
		//
	}

	//#endregion Friends
}
