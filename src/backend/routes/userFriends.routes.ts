import { Hono } from 'hono';

type UserFriendsVars = {
	id: string;
	friendId?: string;
};

const app = new Hono<{ Variables: UserFriendsVars }>();

// Add a friend to a user’s friend list.
app.post('/', async (c) => {
	c.req.param('id');
	return c.json({ message: 'adding a friend to a user’s friend list' });
});

// Retrieve a list of all friends for a given user.
app.get('/', async (c) => {
	return c.json({ message: 'retrieving a list of all friends for a given user' });
});

// Confirm a friend request
app.patch('/:friendId', async (c) => {
	return c.json({ message: 'confirming a friend request' });
});

// Remove a friend from a user’s friend list.
app.delete('/:friendId', async (c) => {
	return c.json({ message: 'removing a friend from a user’s friend list' });
});

export default app;
