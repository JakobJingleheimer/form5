import composeData from './composeData.js';

import {
	generateFieldData,
	generateFormData,
	MockField,
} from './fields.fixture.js';


const imgFile1 = new File(
	[''],
	'me.jpg',
	{ type: 'image/jpeg' },
);
const imgFile2 = new File(
	[''],
	'me2.jpg',
	{ type: 'image/jpeg' },
);

describe('composeData()', () => {
	describe('fieldset', () => {
		let mockFormElms1;

		function disabledAndReadonly() {
			context('and readonly', () => {
				it('should exclude nested field values', () => {
					for (const elm of mockFormElms1) if (elm.tagName === 'FIELDSET') {
						elm.disabled = true;
						elm.readonly = undefined;
					}

					const vals = mockFormElms1.reduce(composeData, {});

					expect(vals).to.eql({
						age: 21,
						newsletterOptin: true,
					});
				});
			});
		}

		context('when named', () => {
			beforeEach(() => {
				mockFormElms1 = generateFormData(true);
			});

			it('should return a nested data object of name-value pairs', () => {
				const vals = mockFormElms1.reduce(composeData, {});

				expect(vals).to.eql({
					age: 21,
					names: {
						forename: 'Jakob',
						surname: 'jingleheimer',
					},
					contactDetails: {
						email: 'jakob.jingleheimer@test.dev',
						tel: '4165555555',
					},
					newsletterOptin: true,
				});
			});

			context('when disabled', () => {
				context('but NOT readonly', () => {
					it('should void nested field values', () => {
						for (const elm of mockFormElms1) {
							if (elm.tagName === 'FIELDSET') elm.disabled = true;
							else if (elm.name === 'forename') { // branch where `name` is not set
								elm.id = elm.name;
								elm.name = '';
							}
						}

						const vals = mockFormElms1.reduce(composeData, {});

						expect(vals).to.eql({
							age: 21,
							contactDetails: {
								email: null,
								tel: null,
							},
							names: {
								forename: null,
								surname: null,
							},
							newsletterOptin: true,
						});
					});
				});

				context('and readonly', disabledAndReadonly);
			});

			context('when ONLY readonly', () => {
				it('should exclude nested field values', () => {
					for (const elm of mockFormElms1) if (elm.tagName === 'FIELDSET') {
						elm.readonly = undefined;
					}

					const vals = mockFormElms1.reduce(composeData, {});

					expect(vals).to.eql({
						age: 21,
						newsletterOptin: true,
					});
				});
			});
		});

		context('when anonymous', () => {
			beforeEach(() => {
				mockFormElms1 = generateFormData(false);
			});

			it('should ignore the anonymous wrapper', () => {
				const vals = mockFormElms1.reduce(composeData, {});

				expect(vals).to.eql({
					forename: 'Jakob',
					surname: 'jingleheimer',
					age: 21,
					email: 'jakob.jingleheimer@test.dev',
					tel: '4165555555',
					newsletterOptin: true,
				});
			});

			context('when disabled', () => {
				context('but NOT readonly', () => {
					it('should void nested field values', () => {
						for (const elm of mockFormElms1) {
							if (elm.tagName === 'FIELDSET') elm.disabled = true;
							else if (elm.name === 'forename') { // branch where `name` is not set
								elm.id = elm.name;
								elm.name = '';
							}
						}

						const vals = mockFormElms1.reduce(composeData, {});

						expect(vals).to.eql({
							age: 21,
							email: null,
							forename: null,
							newsletterOptin: true,
							surname: null,
							tel: null,
						});
					});
				});

				context('and readonly', disabledAndReadonly);
			});

			context('when ONLY readonly', () => {
				it('should include nested field values', () => {
					for (const elm of mockFormElms1) if (elm.tagName === 'FIELDSET') elm.readonly = undefined;

					const vals = mockFormElms1.reduce(composeData, {});

					expect(vals).to.eql({
						age: 21,
						forename: 'Jakob',
						surname: 'jingleheimer',
						email: 'jakob.jingleheimer@test.dev',
						tel: '4165555555',
						newsletterOptin: true,
					});
				});
			});
		});

		context('when disabled (irrespective of anonymous vs named)', () => {
			it('should NOT mutate nested elements’ `disabled`', () => {
				const nestedFields = [];

				mockFormElms1 = generateFormData(false);
				for (const elm of mockFormElms1) if (elm.tagName === 'FIELDSET') {
					elm.disabled = true;
					Array.prototype.push.apply(nestedFields, elm.elements);
				}

				mockFormElms1.reduce(composeData, {}); // don't care about the output

				for (const nestedField of nestedFields) {
					expect(nestedField.disabled, nestedField.name).to.not.be.ok; // ok → truthy
				}
			});
		});
	});

	describe('input: checkbox', () => {
		let newsletterOptin;

		beforeEach(() => {
			({ newsletterOptin } = generateFieldData(false));
		});

		it('should set `true` when checked', () => {
			newsletterOptin.checked = true;

			const vals = [
				newsletterOptin,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[newsletterOptin.name]: newsletterOptin.checked,
			});
		});

		it('should set `false` when not checked', () => {
			newsletterOptin.checked = false;

			const vals = [
				newsletterOptin,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[newsletterOptin.name]: newsletterOptin.checked,
			});
		});

		context('when `value` is set', () => {
			it('should use `value` when checked', () => {
				newsletterOptin.checked = true;
				newsletterOptin.value = 'yes';

				const vals = [
					newsletterOptin,
				].reduce(composeData, {});

				expect(vals).to.eql({
					[newsletterOptin.name]: newsletterOptin.value,
				});
			});

			context('when part of a group', () => {
				it('should use a list of `value`s when checked', () => {
					const name = 'statuses';
					const draft = new MockField({
						checked: true,
						id: `${name}[]`,
						tagName: 'INPUT',
						type: 'checkbox',
						value: 'draft',
					});
					const pending = new MockField({
						checked: true,
						id: `${name}[]`,
						tagName: 'INPUT',
						type: 'checkbox',
						value: 'pending',
					});
					const submitted = new MockField({
						checked: false,
						id: `${name}[]`,
						tagName: 'INPUT',
						type: 'checkbox',
						value: 'submitted',
					});
					const vals = [
						draft,
						pending,
						submitted,
					].reduce(composeData, {});

					expect(vals).to.eql({
						[name]: ['draft', 'pending'],
					});
				});

				it('should have an empty list when none are checked', () => {
					const name = 'statuses';
					const draft = new MockField({
						checked: false,
						id: `${name}[]`,
						tagName: 'INPUT',
						type: 'checkbox',
						value: 'draft',
					});
					const pending = new MockField({
						checked: false,
						id: `${name}[]`,
						tagName: 'INPUT',
						type: 'checkbox',
						value: 'pending',
					});
					const submitted = new MockField({
						checked: false,
						id: `${name}[]`,
						tagName: 'INPUT',
						type: 'checkbox',
						value: 'submitted',
					});
					const vals = [
						draft,
						pending,
						submitted,
					].reduce(composeData, {});

					expect(vals).to.eql({
						[name]: new Array(),
					});
				});
			});
		});
	});

	describe('input: file', () => {
		let fieldUpload;

		beforeEach(() => {
			fieldUpload = new MockField({
				multiple: false,
				name: 'upload',
				tagName: 'INPUT',
				type: 'file',
			});
		});

		describe('dragged', () => {
			it('should include a list of 1 when not multiple', () => {
				fieldUpload.dataTransfer = [
					imgFile1,
				];

				const vals = [
					fieldUpload,
				].reduce(composeData, {});

				expect(vals).to.eql({
					[fieldUpload.name]: fieldUpload.dataTransfer,
				});
			});

			it('should include a list of all when multiple', () => {
				fieldUpload.dataTransfer = [
					imgFile1,
					imgFile2,
				];

				const vals = [
					fieldUpload,
				].reduce(composeData, {});

				expect(vals).to.eql({
					upload: fieldUpload.dataTransfer,
				});
			});
		});

		describe('selected', () => {
			it('should include a list of 1 when not multiple', () => {
				fieldUpload.files = [
					imgFile1,
				];

				const vals = [
					fieldUpload,
				].reduce(composeData, {});

				expect(vals).to.eql({
					[fieldUpload.name]: fieldUpload.files,
				});
			});

			it('should include a list of all when multiple', () => {
				fieldUpload.files = [
					imgFile1,
					imgFile2,
				];

				const vals = [
					fieldUpload,
				].reduce(composeData, {});

				expect(vals).to.eql({
					[fieldUpload.name]: fieldUpload.files,
				});
			});
		});
	});

	describe('input (list)', () => {
		it('should set the values in a list, ordered by DOM sequence', () => {
			const foo1 = new MockField({
				name: 'foo[]',
				tagName: 'INPUT',
				type: 'number',
				value: '3',
			});
			const foo2 = new MockField({
				name: 'foo[]',
				tagName: 'INPUT',
				type: 'number',
				value: '42',
			});
			const vals = [
				foo1,
				foo2,
			].reduce(composeData, {});

			expect(vals).to.eql({
				foo: [
					+foo1.value,
					+foo2.value,
				],
			});
		});
	});

	describe('input: number', () => {
		let fieldAge;

		beforeEach(() => {
			fieldAge = fieldAge = new MockField({
				name: 'age',
				placeholder: '18',
				tagName: 'INPUT',
				type: 'number',
				value: '21',
			});
		});

		it('should set `undefined` when no option is selected', () => {
			fieldAge.value = ''

			const vals = [
				fieldAge,
			].reduce(composeData, {});

			expect(vals).to.eql({
				age: undefined,
			});
		});

		it('should set the value of the selected option', () => {
			const vals = [
				fieldAge,
			].reduce(composeData, {});

			expect(vals).to.eql({
				age: 21,
			});
		});
	});

	describe('input: radio', () => {
		const name = 'gender';
		let fieldGenderM;
		let fieldGenderF;
		let fieldGenderN;

		beforeEach(() => {
			fieldGenderM = new MockField({
				name,
				tagName: 'INPUT',
				type: 'radio',
				value: 'M',
			});
			fieldGenderF = new MockField({
				name,
				tagName: 'INPUT',
				type: 'radio',
				value: 'F',
			});
			fieldGenderN = new MockField({
				name,
				tagName: 'INPUT',
				type: 'radio',
				value: 'N',
			});
		});

		it('should set `undefined` when no option is selected', () => {
			const vals = [
				fieldGenderF,
				fieldGenderM,
				fieldGenderN,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[name]: undefined,
			});
		});

		it('should set the value of the selected option', () => {
			fieldGenderM.checked = true;

			const vals = [
				fieldGenderF,
				fieldGenderM,
				fieldGenderN,
			].reduce(composeData, {});

			expect(vals).to.eql({
				gender: fieldGenderM.value,
			});
		});
	});

	describe('select', () => {
		let optContactMethodEm;
		let optContactMethodPh;
		let optContactMethodTx;

		beforeEach(() => {
			optContactMethodEm = new MockField({
				tagName: 'OPTION',
				value: 'email',
			});
			optContactMethodTx = new MockField({
				tagName: 'OPTION',
				value: 'sms',
			});
			optContactMethodPh = new MockField({
				tagName: 'OPTION',
				value: 'phone',
			});
		});

		it('should set `undefined` when no option is selected', () => {
			const fieldContactMethod = new MockField({
				multiple: false,
				name: 'contactMethod',
				options: [
					optContactMethodEm,
					optContactMethodPh,
					optContactMethodTx,
				],
				tagName: 'SELECT',
			});

			const vals = [
				fieldContactMethod,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldContactMethod.name]: undefined,
			});
		});

		it('should set the value of the selected option when not multiple', () => {
			const fieldContactMethod = new MockField({
				multiple: false,
				name: 'contactMethod',
				options: [
					optContactMethodEm,
					optContactMethodPh,
					optContactMethodTx,
				],
				tagName: 'SELECT',
				value: optContactMethodEm.value,
			});

			const vals = [
				fieldContactMethod,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldContactMethod.name]: fieldContactMethod.value,
			});
		});

		it('should set the value of the selected option when not multiple', () => {
			const fieldContactMethod = new MockField({
				multiple: true,
				name: 'contactMethod',
				options: [
					optContactMethodEm,
					optContactMethodPh,
					optContactMethodTx,
				],
				selectedOptions: [
					optContactMethodTx,
					optContactMethodEm,
				],
				tagName: 'SELECT',
				value: optContactMethodEm.value,
			});

			const vals = [
				fieldContactMethod,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldContactMethod.name]: [
					optContactMethodTx.value,
					optContactMethodEm.value,
				],
			});
		});
	});

	describe('textarea', () => {
		let fieldFreeRsp;

		beforeEach(() => {
			fieldFreeRsp = new MockField({
				name: 'freeResponse',
				tagName: 'TEXTAREA',
				value: '',
			});
		});

		it('should set `undefined` when no content has been entered', () => {
			const vals = [
				fieldFreeRsp,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldFreeRsp.name]: undefined,
			});
		});

		it('should set to text entered', () => {
			fieldFreeRsp.value = 'hello world';

			const vals = [
				fieldFreeRsp,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldFreeRsp.name]: fieldFreeRsp.value,
			});
		});
	});

	describe('field with `id` but no `name`', () => {
		it('should fallback to `id`', () => {
			const field = new MockField({
				id: 'freeResponse',
				name: '',
				tagName: 'TEXTAREA',
				value: 'foo',
			});
			const vals = [field].reduce(composeData, {});

			expect(vals).to.eql({ [field.id]: field.value });
		});
	});

	describe('field with neither `id` nor `name`', () => {
		it('should exclude the field', () => {
			const field = new MockField({
				id: '',
				name: '',
				tagName: 'INPUT',
				value: 'foo',
			});
			const vals = [field].reduce(composeData, {});

			expect(vals).to.eql({});
		});
	});

	describe('disabled field', () => {
		it('should set own value to `null`', () => {
			const field = new MockField({
				disabled: true,
				name: 'freeResponse',
				tagName: 'TEXTAREA',
				value: 'foo',
			});
			const vals = [field].reduce(composeData, {});

			expect(vals).to.eql({ [field.name]: null });
		});
	});

	describe('readOnly field', () => {
		it('should set own value to `null`', () => {
			const field1 = new MockField({
				readonly: undefined,
				name: 'freeResponse1',
				tagName: 'TEXTAREA',
				value: 'foo',
			});
			const field2 = new MockField({
				name: 'freeResponse2',
				tagName: 'TEXTAREA',
				value: 'bar',
			});
			const vals = [
				field1,
				field2,
			].reduce(composeData, {});

			expect(vals).to.eql({ [field2.name]: field2.value });
		});
	});
});
