import { users } from '../db/schema';

export type CreateUserData = Pick<typeof users.$inferInsert, 'username' | 'email'>;
export type User = typeof users.$inferSelect;
