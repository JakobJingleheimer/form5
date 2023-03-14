import composeData from './composeData.js';

import {
	generateFieldData,
	generateFormData,
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

		function whenReadonly() {
			it('should exclude nested field values', () => {
				for (const elm of mockFormElms1) if (elm.tagName === 'FIELDSET') elm.readonly = true;

				const vals = mockFormElms1.reduce(composeData, {});

				expect(vals).to.eql({
					age: 21,
					newsletterOptin: true,
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

			context('when disabled (but not readonly)', () => {
				it('should void nested field values', () => {
					for (const elm of mockFormElms1) if (elm.tagName === 'FIELDSET') elm.disabled = true;

					const vals = mockFormElms1.reduce(composeData, {});

					expect(vals).to.eql({
						age: 21,
						newsletterOptin: true,
					});
				});
			});

			context('when readonly', whenReadonly);
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

			context('when disabled (but not readonly)', () => {
				it('should exclude nested field values', () => {
					for (const elm of mockFormElms1) if (elm.tagName === 'FIELDSET') elm.disabled = true;

					const vals = mockFormElms1.reduce(composeData, {});

					expect(vals).to.eql({
						age: 21,
						newsletterOptin: true,
					});
				});
			});

			context('when readonly', whenReadonly);
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
	});

	describe('input: file', () => {
		let fieldUpload;

		beforeEach(() => {
			fieldUpload = {
				multiple: false,
				name: 'upload',
				tagName: 'INPUT',
				type: 'file',
			};
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
			const foo1 = {
				name: 'foo[]',
				tagName: 'INPUT',
				type: 'number',
				value: '3',
			};
			const foo2 = {
				name: 'foo[]',
				tagName: 'INPUT',
				type: 'number',
				value: '42',
			};
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
			fieldAge = fieldAge = {
				name: 'age',
				placeholder: '18',
				tagName: 'INPUT',
				type: 'number',
				value: '21',
			};
		});

		it('should set `null` when no option is selected', () => {
			fieldAge.value = ''

			const vals = [
				fieldAge,
			].reduce(composeData, {});

			expect(vals).to.eql({
				age: null,
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
			fieldGenderM = {
				name,
				tagName: 'INPUT',
				type: 'radio',
				value: 'M',
			};
			fieldGenderF = {
				name,
				tagName: 'INPUT',
				type: 'radio',
				value: 'F',
			};
			fieldGenderN = {
				name,
				tagName: 'INPUT',
				type: 'radio',
				value: 'N',
			};
		});

		it('should set `null` when no option is selected', () => {
			const vals = [
				fieldGenderF,
				fieldGenderM,
				fieldGenderN,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[name]: null,
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
			optContactMethodEm = {
				tagName: 'OPTION',
				value: 'email',
			};
			optContactMethodTx = {
				tagName: 'OPTION',
				value: 'sms',
			};
			optContactMethodPh = {
				tagName: 'OPTION',
				value: 'phone',
			};
		});

		it('should set `null` when no option is selected', () => {
			const fieldContactMethod = {
				multiple: false,
				name: 'contactMethod',
				options: [
					optContactMethodEm,
					optContactMethodPh,
					optContactMethodTx,
				],
				tagName: 'SELECT',
			};

			const vals = [
				fieldContactMethod,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldContactMethod.name]: null,
			});
		});

		it('should set the value of the selected option when not multiple', () => {
			const fieldContactMethod = {
				multiple: false,
				name: 'contactMethod',
				options: [
					optContactMethodEm,
					optContactMethodPh,
					optContactMethodTx,
				],
				tagName: 'SELECT',
				value: optContactMethodEm.value,
			};

			const vals = [
				fieldContactMethod,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldContactMethod.name]: fieldContactMethod.value,
			});
		});

		it('should set the value of the selected option when not multiple', () => {
			const fieldContactMethod = {
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
			};

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
			fieldFreeRsp = {
				name: 'freeResponse',
				tagName: 'TEXTAREA',
				value: '',
			};
		});

		it('should set `null` when no content has been entered', () => {
			const vals = [
				fieldFreeRsp,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldFreeRsp.name]: null,
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
			const field = {
				id: 'freeResponse',
				name: '',
				tagName: 'TEXTAREA',
				value: 'foo',
			};
			const vals = [field].reduce(composeData, {});

			expect(vals).to.eql({ [field.id]: field.value });
		});
	});

	describe('field with neither `id` nor `name`', () => {
		it('should exclude the field', () => {
			const field = {
				id: '',
				name: '',
				tagName: 'INPUT',
				value: 'foo',
			};
			const vals = [field].reduce(composeData, {});

			expect(vals).to.eql({});
		});
	});

	describe('disabled field', () => {
		it('should set own value to `null`', () => {
			const field = {
				disabled: true,
				name: 'freeResponse',
				tagName: 'TEXTAREA',
				value: 'foo',
			};
			const vals = [field].reduce(composeData, {});

			expect(vals).to.eql({ [field.name]: null });
		});
	});
});
