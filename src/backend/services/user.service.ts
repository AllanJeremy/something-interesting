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
	public async userExists(userId: string): Promise<boolean> {
		// TODO: Debug this -> currently fails with db error when record is not found
		const userExists = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);

		return userExists.length > 0;
	}

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
}
