import { faker } from '@faker-js/faker';

let count = 1;

self.onmessage = async () => {
	while (count > 0) {
		const generateRandomContacts = (num: number) => {
			const contacts = [];
			for (let i = 0; i < num; i++) {
				contacts.push({
					id: i,
					name: faker.person.fullName(),
					email: faker.internet.email(),
					phone: faker.phone.number(),
				});
			}
			return contacts;
		};

		const randomContacts = generateRandomContacts(100);
		postMessage(randomContacts);
		count--;
	}
};

export {};
