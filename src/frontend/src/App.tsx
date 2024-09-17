import { useEffect, useState } from 'react';

import './App.css';

function App() {
	const [count, setCount] = useState(0);

	const [users, setUsers] = useState([]);

	useEffect(() => {
		fetch('http://localhost:8787/api/users')
			.then((response) => response.json())
			.then(({ data }) => setUsers(data))
			.catch((error) => console.error('Error fetching users:', error));
	}, []);

	return (
		<>
			<h1>User List</h1>
			<ul>
				{users.map((user) => (
					<li key={user.id}>{user.username}</li>
				))}
			</ul>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
			</div>
		</>
	);
}

export default App;
