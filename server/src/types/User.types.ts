import { users, userFriends } from '../db/schema';

export type CreateUserData = Pick<typeof users.$inferInsert, 'username' | 'email'>;
export type User = typeof users.$inferSelect;
export type UserStats = {
	totalUsers: number;
};

export type CreateUserFriendData = Pick<typeof userFriends.$inferInsert, 'userId' | 'friendUserId'>;
export type UserFriendship = typeof userFriends.$inferSelect;
export type UserFriendshipStats = {
	totalFriendships: number;
};

export type UserFriendshipWithUser = UserFriendship & {
	user: Pick<User, 'username'>;
	friend: Pick<User, 'username'>;
};
