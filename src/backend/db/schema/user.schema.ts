import { pgTable, integer, uuid, varchar, boolean, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('role', ['admin', 'user']);

/**
 * Represents a user in the system.
 * This table stores essential user information such as:
 * - Unique identifiers (id, username, email)
 * - Social metrics (friend count)
 * - Account status (is active)
 * - User permissions (role)
 * - Timestamps for tracking user activity and account lifecycle
 */
export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		username: varchar('username', { length: 16 }).notNull().unique(), // Max username length 16 chars
		email: varchar('email', { length: 320 }).notNull().unique(), // Max length of an email according to RFC 3696 is 320
		friendCount: integer('friend_count').notNull().default(0),
		pendingFriendCount: integer('pending_friend_count').notNull().default(0),
		isActive: boolean('is_active').notNull().default(true),
		role: userRoleEnum('role').default('user'),

		lastLoginAt: timestamp('last_login_at'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(), // TODO: Actually make this update when the user is updated
	},
	(table) => ({
		// Set index for friend count for efficient sorting/filtering by friend count
		friendCountIndex: index('friend_count_index').on(table.friendCount),
		pendingFriendCountIndex: index('pending_friend_count_index').on(table.pendingFriendCount),
	})
);
