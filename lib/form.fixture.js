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
const fieldsets = {
	contactDetails: {
		elements: [
			fields.email,
			fields.tel,
		],
		name: 'contactDetails',
		tagName: 'FIELDSET',
	},
	names: {
		elements: [
			fields.forename,
			fields.surname,
		],
		name: 'names',
		tagName: 'FIELDSET',
	},
};
const buttonSubmit = {
	tagName: 'BUTTON',
	type: 'submit',
};

export function generateFieldData(nested = true) {
	return {
		...(!nested) && { [fieldsets.names.name]: fieldsets.names },
		[fields.forename.name]: {...fields.forename},
		[fields.surname.name]: {...fields.surname},
		...(!nested) && { [fieldsets.contactDetails.name]: fieldsets.contactDetails },
		[fields.email.name]: {...fields.email},
		[fields.tel.name]: {...fields.tel},
		[fields.age.name]: {...fields.age},
		[fields.newsletterOptin.name]: {...fields.newsletterOptin},
	};
}

export function generateFormData(nested = true) {
	return [
		{
			...fieldsets.names,
			...(!nested) && { name: undefined },
		},
		{...fields.forename},
		{...fields.surname},
		{
			...fieldsets.contactDetails,
			...(!nested) && { name: undefined },
		},
		{...fields.email},
		fields.tel,
		{...fields.age},
		{...fields.newsletterOptin},
		buttonSubmit,
	];
}
