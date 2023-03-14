const fields = {
	age: {
		name: 'age',
		placeholder: '18',
		tagName: 'INPUT',
		type: 'number',
		value: '21',
	},
	forename: {
		name: 'forename',
		placeholder: 'Jane',
		tagName: 'INPUT',
		type: 'text',
		value: 'Jakob',
	},
	surname: {
		name: 'surname',
		placeholder: 'Smith',
		tagName: 'INPUT',
		type: 'text',
		value: 'jingleheimer',
	},
	email: {
		name: 'email',
		placeholder: 'hello@example.com',
		tagName: 'INPUT',
		type: 'email',
		value: 'jakob.jingleheimer@test.dev',
	},
	tel: {
		name: 'tel',
		placeholder: '5555555555',
		tagName: 'INPUT',
		type: 'tel',
		value: '4165555555',
	},
	newsletterOptin: {
		checked: true,
		name: 'newsletterOptin',
		tagName: 'INPUT',
		type: 'checkbox',
		value: true,
	},
};
const buttonSubmit = {
	tagName: 'BUTTON',
	type: 'submit',
};

export class MockField {
	constructor(init) { Object.assign(this, init) }
	hasAttribute(name) { return name in this; }
}

export function generateFieldData(nested = true) {
	const forename = new MockField(fields.forename);
	const surname = new MockField(fields.surname);
	const email = new MockField(fields.email);
	const tel = new MockField(fields.tel);

	const names = new MockField({
		elements: [
			forename,
			surname,
		],
		...(nested) && { name: 'names' },
		tagName: 'FIELDSET'
	});
	const contactDetails = new MockField({
		elements: [
			email,
			tel,
		],
		...(nested) && { name: 'contactDetails' },
		tagName: 'FIELDSET'
	});

	return {
		...(!nested) && { [names.name]: names },
		[forename.name]: forename,
		[surname.name]: surname,
		...(!nested) && { [contactDetails.name]: contactDetails },
		[email.name]: email,
		[tel.name]: tel,
		[fields.age.name]: new MockField(fields.age),
		[fields.newsletterOptin.name]: new MockField(fields.newsletterOptin),
	};
}

export function generateFormData(nested = true) {
	const forename = new MockField(fields.forename);
	const surname = new MockField(fields.surname);
	const email = new MockField(fields.email);
	const tel = new MockField(fields.tel);

	return [
		new MockField({
			elements: [
				forename,
				surname,
			],
			...(nested) && { name: 'names' },
			tagName: 'FIELDSET'
		}),
		forename,
		surname,
		new MockField({
			elements: [
				email,
				tel,
			],
			...(nested) && { name: 'contactDetails' },
			tagName: 'FIELDSET'
		}),
		email,
		tel,
		new MockField(fields.age),
		new MockField(fields.newsletterOptin),
		buttonSubmit,
	];
}
