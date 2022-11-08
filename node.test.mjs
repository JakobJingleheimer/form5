import assert from 'node:assert';

{
	const lib = await import('react-form5');

	assert.ok(lib.Button);
	assert.ok(lib.FileInput);
	assert.ok(lib.Form);
	assert.ok(lib.Input);
}

{
	const buttonImport = import('react-form5/Button')
		.then((Button) => assert.ok(Button));
	const fileInputImport = import('react-form5/FileInput')
		.then((FileInput) => assert.ok(FileInput));
	const formImport = import('react-form5/Form')
		.then((Form) => assert.ok(Form));
	const inputImport = import('react-form5/Input')
		.then((Input) => assert.ok(Input));

	assert.ok(await Promise.all([
		buttonImport,
		fileInputImport,
		formImport,
		inputImport,
	]));
}
