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

export function generateFieldData(nested = true) {
	const forename = {...fields.forename};
	const surname = {...fields.surname};
	const email = {...fields.email};
	const tel = {...fields.tel};

	const names = {
		elements: [
			forename,
			surname,
		],
		...(nested) && { name: 'names' },
		tagName: 'FIELDSET',
	};
	const contactDetails = {
		elements: [
			email,
			tel,
		],
		...(nested) && { name: 'contactDetails' },
		tagName: 'FIELDSET',
	};

	return {
		...(!nested) && { [names.name]: names },
		[forename.name]: {...forename},
		[surname.name]: {...surname},
		...(!nested) && { [contactDetails.name]: contactDetails },
		[email.name]: {...email},
		[tel.name]: {...tel},
		[fields.age.name]: {...fields.age},
		[fields.newsletterOptin.name]: {...fields.newsletterOptin},
	};
}

export function generateFormData(nested = true) {
	const forename = {...fields.forename};
	const surname = {...fields.surname};
	const email = {...fields.email};
	const tel = {...fields.tel};

	return [
		{
			elements: [
				forename,
				surname,
			],
			...(nested) && { name: 'names' },
			tagName: 'FIELDSET',
		},
		forename,
		surname,
		{
			elements: [
				email,
				tel,
			],
			...(nested) && { name: 'contactDetails' },
			tagName: 'FIELDSET',
		},
		email,
		tel,
		{...fields.age},
		{...fields.newsletterOptin},
		buttonSubmit,
	];
}
