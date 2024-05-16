// src/App.tsx
import React, { useState } from 'react';
import useContactsWorker from './hooks/useContactsWorker';

const App: React.FC = () => {
	const { contacts, loading, searchContacts } = useContactsWorker();
	const [query, setQuery] = useState('');

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		searchContacts(e.target.value);
	};

	return (
		<div>
			<h1>Contacts</h1>
			<input
				type='text'
				placeholder='Search contacts'
				value={query}
				onChange={handleSearch}
			/>
			{loading ? (
				<p>Loading...</p>
			) : (
				<ul>
					{contacts.map((contact) => (
						<li key={contact.id}>
							<h2>{contact.name}</h2>
							<p>{contact.email}</p>
							<p>{contact.phone}</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default App;
