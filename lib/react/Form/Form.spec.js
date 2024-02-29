import _each from 'lodash-es/forEach.js';

import {
	onSubmit,
	setup,
} from './Form.jsx';
import {
	generateFieldData,
	generateFormData,
} from '../../fields.fixture.js';

describe('Form', () => {
	let initialFields;
	let initValues;

	function generateFakeSubmissionEvent({
		attrs = { pristine: false },
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
					hasAttribute(name) { return attrs[name] },
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
		initValues = {
			current: undefined,
		};

		setup({ elements: initialFields }, initValues);
	});

	describe('setup()', () => {
		it('should gather initial values', () => {
			expect(initValues.current).to.be.an('object').that.is.not.empty;
		});
	});

	describe('onSubmit()', () => {
		const noop = () => {};

		it('should prevent default form behaviour & event bubbling', () => {
			const { event, spies } = generateFakeSubmissionEvent();

			onSubmit(event, initValues, noop);

			expect(spies.preventDefaultCalled).to.be.true;
			expect(spies.stopPropagationCalled).to.be.true;
		});

		it('should abort when delta is empty', () => {
			let cbCalled = false;
			const { event } = generateFakeSubmissionEvent({ attrs: { pristine: true } });
			const fields = generateFieldData(false);

			event.target.elements = [
				fields.forename,
				fields.surname,
				fields.email,
				fields.tel,
				fields.age,
				fields.newsletterOptin,
			];

			onSubmit(event, initValues, () => cbCalled = true);

			expect(cbCalled).to.be.false;
		});

		it('should abort when validation fails', () => {
			const { event, spies } = generateFakeSubmissionEvent({ valid: false });

			onSubmit(event, initValues, noop);

			expect(spies.reportValidityCalled).to.be.true;
		});

		it('should supply a delta of initial and current values', () => {
			const { event } = generateFakeSubmissionEvent();
			let delta;
			let all;

			function cb(d, a) {
				delta = d;
				all = a;
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

			onSubmit(event, initValues, cb);

			expect(delta, 'delta').to.eql({
				forename,
				surname,
				email,
				tel,
				age: +age,
			});
			expect(all, 'all').to.eql({
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

			onSubmit(event, initValues, noop);

			expect(initValues.current.forename).to.equal(forename);
			expect(initValues.current.surname).to.equal(surname);
		});
	});
});
