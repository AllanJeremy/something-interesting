import { pgTable, uuid, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { relations } from 'drizzle-orm';

/**
 * Represents the friendship relationship between users in the system.
 * This table stores information about user friendships such as:
 * - Unique identifier for the friendship (id)
 * - References to both users involved in the friendship (userId, friendUserId)
 * - Friendship status (isConfirmed)
 * - Timestamps for tracking when the friendship was created and last updated
 *
 * Indexes are set on userId and friendUserId for efficient querying of a user's friends.
 */
export const userFriends = pgTable(
	'user_friends',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id),
		friendUserId: uuid('friend_user_id')
			.notNull()
			.references(() => users.id),
		isConfirmed: boolean('is_confirmed').notNull().default(false),
		isBlocked: boolean('is_blocked').notNull().default(false),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(), // TODO: Actually make this update when the friend is updated
	},
	(table) => ({
		// Set index for userId and friendUserId for faster friend lookups
		userIdIndex: index('user_id_index').on(table.userId),
		friendUserIdIndex: index('friend_user_id_index').on(table.friendUserId),
	})
);

export const userFriendsRelations = relations(userFriends, ({ one }) => ({
	user: one(users, {
		fields: [userFriends.userId],
		references: [users.id],
	}),
	friend: one(users, {
		fields: [userFriends.friendUserId],
		references: [users.id],
	}),
}));
