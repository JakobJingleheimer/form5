import assert from 'node:assert';

{
	const lib = await import('form5/react');

	assert.ok(lib.Button);
	assert.ok(lib.FileInput);
	assert.ok(lib.Form);
	assert.ok(lib.Input);
}

{
	const buttonImport = import('form5/react/Button')
		.then((Button) => assert.ok(Button));
	const fileInputImport = import('form5/react/FileInput')
		.then((FileInput) => assert.ok(FileInput));
	const formImport = import('form5/react/Form')
		.then((Form) => assert.ok(Form));
	const inputImport = import('form5/react/Input')
		.then((Input) => assert.ok(Input));

	assert.ok(await Promise.all([
		buttonImport,
		fileInputImport,
		formImport,
		inputImport,
	]));
}
