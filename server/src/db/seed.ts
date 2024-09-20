import { UserService } from '../services/user.service';
import { createDbConnection } from '../db';
import { CreateUserData, User, UserFriendship } from '../types';
import { faker } from '@faker-js/faker';
import { config } from 'dotenv';
import { FriendService } from '../services/friend.service';

config({ path: '.dev.vars' });

const _db = createDbConnection(process.env.DATABASE_URL as string);

//#region Users
const userService = new UserService(_db);

async function _createFakeUsers(n: number): Promise<number> {
	const fakeUsersCreateData: CreateUserData[] = [];
	for (const i in Array(n).fill(0)) {
		const username = faker.internet.userName().substring(0, 16); // ensure it fits within our limits
		const email = faker.internet.email();

		fakeUsersCreateData.push({ username, email });
	}

	// Create the users
	const usersCreated: User[] = await Promise.all(fakeUsersCreateData.map((user) => userService.createUser(user)));

	return usersCreated.length;
}
//#endregion Users

//#region Friendships
const friendService = new FriendService(_db, userService);

function _getUniqueFriendId(userId: string, usersIds: string[]): string {
	let friendId;

	// Get a unique friend id
	while (true) {
		friendId = faker.helpers.arrayElement(usersIds);
		if (friendId !== userId) break;
	}
	return friendId;
}

async function _createFakeFriendships(numToCreate: number): Promise<void> {
	const users = await userService.getAllUsers();

	const usersIds = users.map((user) => user.id);
	const fakeFriendships: { userId: string; friendId: string }[] = [];

	for (const i in Array(numToCreate).fill(0)) {
		const userId = faker.helpers.arrayElement(usersIds);
		const friendId = _getUniqueFriendId(userId, usersIds);
		fakeFriendships.push({ userId, friendId });
	}

	// Create the friendships -> Some might fail due to conflict, so we'll just ignore and keep moving for now (in future, we'd actually retry until we hit n. )
	await Promise.allSettled(fakeFriendships.map(({ userId, friendId }) => friendService.addFriend(userId, friendId)));
}

//#region Friendships

async function seed(userCount = 25, friendshipCount = 75) {
	console.debug('seeding started...');
	try {
		console.info('Creating fake users...');
		const numUsersCreated = await _createFakeUsers(userCount);
		console.info('Fake users created:', numUsersCreated);

		console.info('Creating fake friendships...');
		await _createFakeFriendships(friendshipCount);
		console.info('Fake friendships created');
	} catch (error) {
		console.error(error);
		process.exit(1);
	} finally {
		console.debug('seeding finished...');
	}
}

seed();
