import { SQL, and, eq, or } from 'drizzle-orm';
import { DatabaseConnection } from '../db';
import { userFriends } from '../db/schema';
import { CreateUserFriendData, UserFriendship } from '../types';
import { UserService } from './user.service';
import { calculateOffset } from '../utils/pagination.utils';
import { ConflictError, ForbiddenError, NotFoundError } from '../utils/error.utils';

export class FriendService {
	//#region Constants
	static DEFAULT_FRIENDS_PER_PAGE = 25;
	//#endregion Constants

	constructor(private db: DatabaseConnection, private userService: UserService) {}

	/**
	 * Generates a SQL query condition for a user-initiated friend request
	 * @description This method creates a SQL condition to check if a specific user has sent a friend request to another user
	 * @param userId The id of the user who initiated the friend request
	 * @param friendUserId The id of the user who received the friend request
	 * @returns {SQL} A SQL condition for the user-initiated friend request
	 */
	private _getUserInitiatedFriendRequestQuery(userId: string, friendUserId: string): SQL {
		return and(eq(userFriends.userId, userId), eq(userFriends.friendUserId, friendUserId)) as SQL;
	}

	/**
	 * Generates a SQL query condition for a friend-initiated friend request
	 * @description This method creates a SQL condition to check if a specific user has received a friend request from another user
	 * @param userId The id of the user who received the friend request
	 * @param friendUserId The id of the user who sent the friend request
	 * @returns {SQL} A SQL condition for the friend-initiated friend request
	 */
	private _getFriendInitiatedFriendRequestQuery(userId: string, friendUserId: string): SQL {
		return and(eq(userFriends.userId, friendUserId), eq(userFriends.friendUserId, userId)) as SQL;
	}

	/**
	 * Fetches the user friendship id between two users
	 * @description We only return the id because that's all we need
	 * @param userId The id of the user to check for friendship
	 * @param friendUserId The id of the friend to check for
	 * @returns {Promise<UserFriendship | null>} A promise that resolves to the user friendship if it exists, `null` otherwise
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
	 * Checks if two users are friends or have a pending friend request
	 * @param userId The id of the user to check for friendship
	 * @param friendUserId The id of the friend to check for
	 * @returns {Promise<boolean>} A promise that resolves to `true` if the users are friends or have a pending request, `false` otherwise
	 */
	private async _areFriendsOrHavePendingRequest(userId: string, friendUserId: string): Promise<boolean> {
		const userFriendship = await this._getUserFriendship(userId, friendUserId);
		return userFriendship !== null;
	}

	/**
	 * Checks if both users exist
	 * @param userId The id of the user to check for existence
	 * @param friendUserId The user id of the friend to check for existence
	 * @returns {Promise<boolean>} `true` if both users exist, `false` otherwise
	 */
	private async _bothUserAndFriendExist(userId: string, friendUserId: string): Promise<boolean> {
		const userExists = await this.userService.userExists(userId);
		const friendUserExists = await this.userService.userExists(friendUserId);

		return userExists && friendUserExists;
	}

	/**
	 * Adds a friend request between two users
	 * @param userId The id of the user initiating the friend request
	 * @param friendUserId The id of the user receiving the friend request
	 * @returns {Promise<UserFriendship>} A promise that resolves to the friend request that was created
	 */
	public async addFriend(userId: string, friendUserId: string): Promise<UserFriendship> {
		if (userId === friendUserId) {
			throw new ForbiddenError('You cannot add yourself as a friend');
		}

		const bothUserAndFriendExist = await this._bothUserAndFriendExist(userId, friendUserId);

		// Both users must exist for the friend request to be sent
		if (!bothUserAndFriendExist) {
			throw new NotFoundError('One or both users (initiator or receiver) do not exist');
		}

		const usersAreFriends = await this._areFriendsOrHavePendingRequest(userId, friendUserId);

		if (usersAreFriends) {
			throw new ConflictError('Users are already friends or there is an existing pending request');
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
	 * @param friendshipId The id of the friendship to be confirmed
	 * @returns {Promise<UserFriendship>} A promise that resolves to the friend request that was confirmed
	 */
	public async confirmFriendRequest(userId: string, friendshipId: string): Promise<UserFriendship> {
		const userExists = await this.userService.userExists(userId);

		if (!userExists) {
			throw new NotFoundError('User does not exist');
		}

		// Specifically get the friend request received by the user
		// This ensures that only the recipient of the friend request can confirm it
		const friendshipCondition = and(eq(userFriends.id, friendshipId), eq(userFriends.friendUserId, userId));

		const existingFriendshipRequestResult = await this.db
			.select()
			.from(userFriends)
			.where(friendshipCondition)
			.prepare('get_friendship_request')
			.execute();

		if (existingFriendshipRequestResult.length === 0) {
			throw new NotFoundError('Friendship request not found (or you did not receive this request)');
		}

		const existingFriendshipRequest = existingFriendshipRequestResult[0];

		if (existingFriendshipRequest.isConfirmed) {
			throw new ConflictError('Users are already friends.');
		}

		//* Getting here means the friend request exists and is still pending
		// Confirm the friend request...
		const updatedUserFriendshipResponse = await this.db
			.update(userFriends)
			.set({ isConfirmed: true })
			.where(eq(userFriends.id, existingFriendshipRequest.id))
			.returning()
			.prepare('confirm_friend_request')
			.execute();

		return updatedUserFriendshipResponse[0];
	}

	/**
	 * Removes a friend request between two users
	 * @param userId The id of the user that initiated the friend request
	 * @param friendshipId The id of the friendship to be removed
	 * @returns {Promise<UserFriendship>} A promise that resolves to the friend request that was removed
	 */
	public async removeFriend(userId: string, friendshipId: string): Promise<UserFriendship> {
		// Make sure that the friendship exists and that the user is the one that initiated the friendship
		const friendshipCondition = and(
			eq(userFriends.id, friendshipId),
			or(eq(userFriends.userId, userId), eq(userFriends.friendUserId, userId))
		);

		const existingFriendshipResult = await this.db
			.select()
			.from(userFriends)
			.where(friendshipCondition)
			.prepare('get_friendship')
			.execute();

		// Check if the friendship exists
		if (existingFriendshipResult.length === 0) {
			throw new NotFoundError('Friendship does not exist'); // TODO: Return NotFoundError
		}

		const existingFriendship = existingFriendshipResult[0];

		//* Getting here means the friendship exists
		//? A user can remove a friend whether or not they are the one that initiated the friendship

		// delete the friendship
		const deletedUserFriendship = await this.db
			.delete(userFriends)
			.where(eq(userFriends.id, existingFriendship.id))
			.returning()
			.prepare('remove_friend')
			.execute();

		return deletedUserFriendship[0];
	}

	/**
	 * Retrieves a list of user friendships for a given user
	 * @description This function fetches all friendships where the user is either the initiator or the receiver
	 * @param userId The id of the user to fetch friendships for
	 * @param search The search query for filtering friends (optional)
	 * @param limit The maximum number of friendships to return (default: FriendService.DEFAULT_FRIENDS_PER_PAGE)
	 * @param page The page number for pagination (starting at 1)
	 * @returns {Promise<UserFriendship[]>} A promise that resolves to an array of UserFriendship objects
	 */
	public async getUserFriendList(
		userId: string,
		search: string | null = null,
		limit = FriendService.DEFAULT_FRIENDS_PER_PAGE,
		page = 1
	): Promise<UserFriendship[]> {
		//TODO: Add search friends option

		// Get all friendships where the user is either the initiator or the receiver
		const friendshipCondition = or(eq(userFriends.userId, userId), eq(userFriends.friendUserId, userId));

		const offset = calculateOffset(page, limit);
		const userFriendships = await this.db.select().from(userFriends).where(friendshipCondition).limit(limit).offset(offset);

		return userFriendships;
	}
}
