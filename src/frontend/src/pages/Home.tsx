import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

const Home: React.FC = () => {
	const [users, setUsers] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				console.log('fetching users');
				const response = await fetchApi<any>('/users');

				const usersFromApi = response.data;
				setUsers(usersFromApi);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			}
		};

		fetchUsers();
	}, []);

	return (
		<div>
			<h1 className="text-3xl">Homepage</h1>
			{error && <p>Error: {error}</p>}
			<h2>Users:</h2>
			<ul>
				{users.map((user) => (
					<li key={user.id}>{user.username}</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
