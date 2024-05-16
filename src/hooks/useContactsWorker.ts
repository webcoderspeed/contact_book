import { useCallback, useEffect, useState } from 'react';
import FetchContactWorker from '../workers/fetch-contacts.worker?worker';
import {
  Contact,
	addOrUpdateContactsToDB,
	getContactsFromDB,
	searchContactsInDB,
} from '../indexedDB';

const useContactsWorker = () => {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchFromWorker = () => {
			const worker = new FetchContactWorker();

			worker.postMessage({});

			worker.onmessage = async (event) => {
				const newContacts = event.data;
				const updatedContacts = [...newContacts];
				await addOrUpdateContactsToDB(updatedContacts);
				setLoading(false);
			};

			return () => {
				worker.terminate();
			};
		};

		const initializeContacts = async () => {
			const cachedContacts = await getContactsFromDB();
			if (cachedContacts.length > 0) {
				setLoading(false);
				fetchFromWorker();
			} else {
				fetchFromWorker();
			}
		};

		initializeContacts();
	}, []);

	const searchContacts = useCallback(async (query: string) => {
		setLoading(true);
		const result = await searchContactsInDB(query);
		setContacts(result);
		setLoading(false);
	}, []);

	return { contacts, loading, searchContacts };
};

export default useContactsWorker;
