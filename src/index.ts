import { Hono } from 'hono';

export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
	return c.text('React app will go here');
});

//#region Users
// Create a new user.
app.post('/users', async (c) => {
	return c.json({ message: 'User created' });
});

// Retrieve a list of all users.
app.get('/users', async (c) => {
	return c.json({ message: 'listing all users' });
});

//#endregion Users

//#region Friends

// Add a friend to a user’s friend list.
app.post('/users/:id/friends', async (c) => {
	return c.json({ message: 'adding a friend to a user’s friend list' });
});

// Confirm a friend request
app.patch('/users/:id/friends/:friendId', async (c) => {
	return c.json({ message: 'confirming a friend request' });
});

// Remove a friend from a user’s friend list.
app.delete('/users/:id/friends/:friendId', async (c) => {
	return c.json({ message: 'removing a friend from a user’s friend list' });
});

// Retrieve a list of all friends for a given user.
app.get('/users/:id/friends', async (c) => {
	return c.json({ message: 'retrieving a list of all friends for a given user' });
});

//#endregion Friends

export default app;
