// src/indexedDB.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Contact {
	id: number;
	name: string;
	email: string;
	phone: string;
}

interface MyDB extends DBSchema {
	contacts: {
		key: number;
		value: Contact;
		indexes: { name: string; email: string; phone: string };
	};
}

let dbPromise: Promise<IDBPDatabase<MyDB>>;

const initDB = () => {
	if (!dbPromise) {
		dbPromise = openDB<MyDB>('contacts-db', 1, {
			upgrade(db) {
				const store = db.createObjectStore('contacts', { keyPath: 'id' });
				store.createIndex('phone', 'phone');
			},
		});
	}
	return dbPromise;
};

export const addOrUpdateContactsToDB = async (contacts: Contact[]) => {
	const db = await initDB();
	const tx = db.transaction('contacts', 'readwrite');

	for (const contact of contacts) {
		tx.store.put({
			...contact,
			id: Math.random(),
		});

		// const existingContact = await tx.store.get(contact.id);
		// if (
		// 	!existingContact ||
		// 	JSON.stringify(existingContact) !== JSON.stringify(contact)
		// ) {
		// 	tx.store.put(contact);
		// }
	}

	await tx.done;
};

export const getContactsFromDB = async (): Promise<Contact[]> => {
	const db = await initDB();
	return await db.getAll('contacts');
};

export const searchContactsInDB = async (query: string): Promise<Contact[]> => {
	const db = await initDB();
	const tx = db.transaction('contacts', 'readonly');
	const lowerCaseQuery = query.toLowerCase();

	const phoneIndex = tx.store.index('phone');

	const phoneResults = await phoneIndex.getAll(
		IDBKeyRange.bound(lowerCaseQuery, lowerCaseQuery + '\uffff'),
	);

	const uniqueContacts = new Map<number, Contact>();

	for (const contact of phoneResults) {
		uniqueContacts.set(contact.id, contact);
	}

	return Array.from(uniqueContacts.values());
};
