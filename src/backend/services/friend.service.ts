import { SQL, and, eq, or } from 'drizzle-orm';
import { createDb } from '../db';
import { userFriends } from '../db/schema';
import { CreateUserFriendData, UserFriendship } from '../types';
import { UserService } from './user.service';

export class FriendService {
	//#region Constants
	static DEFAULT_FRIENDS_PER_PAGE = 25;
	//#endregion Constants

	//#region Constructor
	private db: ReturnType<typeof createDb>;

	constructor(private databaseUrl: string, private userService: UserService) {
		this.db = createDb(databaseUrl);
	}
	//#endregion Constructor

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
	 * Checks if two users are friends or have a pending friend request
	 * @param userId The id of the user to check for friendship
	 * @param friendUserId The id of the friend to check for
	 * @returns `true` if the users are friends or have a pending request, `false` otherwise
	 */
	private async _areFriendsOrHavePendingRequest(userId: string, friendUserId: string): Promise<boolean> {
		const userFriendship = await this._getUserFriendship(userId, friendUserId);
		return userFriendship !== null;
	}

	/**
	 * Checks if both users exist
	 * @param userId The id of the user to check for existence
	 * @param friendUserId The user id of the friend to check for existence
	 * @returns `true` if both users exist, `false` otherwise
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

		const usersAreFriends = await this._areFriendsOrHavePendingRequest(userId, friendUserId);

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
	 * @param friendshipId The id of the friendship to be confirmed
	 * @returns The friend request that was confirmed
	 */
	public async confirmFriendRequest(userId: string, friendshipId: string): Promise<UserFriendship> {
		const userExists = await this.userService.userExists(userId);

		if (!userExists) {
			throw new Error('User does not exist');
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
			throw new Error('Friendship request not found (or you did not receive this request)');
		}

		const existingFriendshipRequest = existingFriendshipRequestResult[0];

		if (existingFriendshipRequest.isConfirmed) {
			throw new Error('Users are already friends.');
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
	 * @returns The friend request that was removed
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
			throw new Error('Friendship does not exist'); // TODO: Return NotFoundError
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

	public async getUserFriendList(userId: string, limit = FriendService.DEFAULT_FRIENDS_PER_PAGE, offset = 0): Promise<UserFriendship[]> {
		// Get all friendships where the user is either the initiator or the receiver
		const friendshipCondition = or(eq(userFriends.userId, userId), eq(userFriends.friendUserId, userId));

		const userFriendships = await this.db.select().from(userFriends).where(friendshipCondition).limit(limit).offset(offset);

		return userFriendships;
	}
}
