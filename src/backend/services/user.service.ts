import { users, userFriends } from '../db/schema';

export class UserService {
	//#region Constants
	//* These values never change from instance to instance - so we make them static
	static MIN_USERNAME_CHARS = 3;
	static MAX_USERNAME_CHARS = 16; //? Should match `users.username` column max length in db
	static MAX_EMAIL_CHARS = 320; //? Should match `users.email` column max length in db

	static DEFAULT_USERS_PER_PAGE = 50;
	static DEFAULT_FRIENDS_PER_PAGE = 25;

	//#endregion Constants

	/** A performant way to check if a user with a specific id exists
	 * @param userId The id of the user to check for existence
	 */
	private async _userExists(userId: string): Promise<boolean> {
		//
		return true;
	}

	//#region Users
	public async createUser(userData: any) {}

	public async getAllUsers(searchQuery?: string, limit = UserService.DEFAULT_USERS_PER_PAGE, page = 1) {
		//
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

	public async getUserFriendList(userId: string, limit = UserService.DEFAULT_FRIENDS_PER_PAGE, page = 1) {
		//
	}

	//#endregion Friends
}