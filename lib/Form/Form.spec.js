import _each from 'lodash-es/forEach.js';

await import('react')
	.then((module) => ({
		PureComponent: class MOCK_PureComponent {},
	}));

import Form from './index.jsx';
import {
	generateFieldData,
	generateFormData,
} from '../fixtures.js';

describe('Form', () => {
	let initialFields;
	let form;

	function generateFakeSubmissionEvent({
		valid = true
	} = {}) {
		const spies = {
			preventDefaultCalled: false,
			reportValidityCalled: false,
			stopPropagationCalled: false,
		};

		return {
			event: {
				preventDefault() { spies.preventDefaultCalled = true },
				stopPropagation() { spies.stopPropagationCalled = true },
				target: {
					elements: [],
					reportValidity() {
						spies.reportValidityCalled = true;
						return valid;
					},
				},
			},
			spies,
		}
	}

	beforeEach(() => {
		initialFields = generateFormData(false);
		form = new Form();
	});

	describe('setRef()', () => {
		it('should gather initial values', () => {
			form.setRef({ elements: initialFields })

			expect(form.initValues).to.be.an('object').that.is.not.empty;
		});
	});

	describe('onSubmit()', () => {
		const noop = () => {};
		let initValues;

		beforeEach(() => {
			form.setRef({ elements: initialFields });

			({ initValues } = form);
		});

		it('should prevent default form behaviour & event bubbling', () => {
			const { event, spies } = generateFakeSubmissionEvent();

			form.onSubmit(event, initValues, noop);

			expect(spies.preventDefaultCalled).to.be.true;
			expect(spies.stopPropagationCalled).to.be.true;
		});

		it('should abort when validation fails', () => {
			const { event, spies } = generateFakeSubmissionEvent({ valid: false});

			form.onSubmit(event, initValues, noop);

			expect(spies.reportValidityCalled).to.be.true;
		});

		it('should supply a delta of initial and current values', () => {
			const { event } = generateFakeSubmissionEvent();
			let delta;
			let currentValues;

			function cb(d, v) {
				delta = d;
				currentValues = v;
			}

			const fields = generateFieldData(false);

			const forename = 'Phoebe';
			const surname = 'Prophet';
			const email = 'phoebe@proffet.nl';
			const tel = '0655555555';
			const age = '31';
			const newsletterOptin = fields.newsletterOptin.checked;

			fields.forename.value = forename;
			fields.surname.value = surname;
			fields.email.value = email;
			fields.tel.value = tel;
			fields.age.value = age;
			fields.newsletterOptin.checked = newsletterOptin;

			event.target.elements = [
				fields.forename,
				fields.surname,
				fields.email,
				fields.tel,
				fields.age,
				fields.newsletterOptin,
			];

			form.onSubmit(event, initValues, cb);

			expect(delta, 'delta').to.eql({
				forename,
				surname,
				email,
				tel,
				age: +age,
			});
			expect(currentValues, 'values').to.eql({
				forename,
				surname,
				email,
				tel,
				age: +age,
				newsletterOptin,
			});
		});

		it('should update initial values to new values (in case of resubmission)', () => {
			const { event } = generateFakeSubmissionEvent();
			const fields = generateFieldData(false);

			const forename = 'Phoebe';
			const surname = 'Prophet';

			fields.forename.value = forename;
			fields.surname.value = surname;

			event.target.elements = [
				fields.forename,
				fields.surname,
				fields.email,
				fields.tel,
				fields.age,
				fields.newsletterOptin,
			];

			form.onSubmit(event, initialFields, noop);

			expect(form.initValues.forename).to.equal(forename);
			expect(form.initValues.surname).to.equal(surname);
		});
	});
});
