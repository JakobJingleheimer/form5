import { fireEvent, render } from '@testing-library/react';

import Field from '../Field/Field.jsx';
import Form from './Form.jsx';


describe('<Form>', () => {
	const labelText = 'foo bar';
	function noop() {}

	describe('initially', () => {
		it('should be pristine and untouched', () => {
			const { container: { firstChild: form } } = render(
				<Form name="foo" onSubmit={noop} />
			);

			expect(form.hasAttribute('pristine'), 'pristine').to.be.true;
			expect(form.hasAttribute('touched'), 'touched').to.be.false;
		});
	});

	describe('onBlur', () => {
		it('should be touched', () => {
			const {
				container: { firstChild: form },
				getByLabelText,
			} = render(
				<Form name="foo" onSubmit={noop}>
					<Field
						id="bar"
						label={labelText}
						name="foo"
					/>
				</Form>
			);

			const input = getByLabelText(labelText);

			fireEvent.blur(input, { target: {} });

			expect(form.hasAttribute('pristine'), 'pristine').to.be.true;
			expect(form.hasAttribute('touched'), 'touched').to.be.true;
		});
	});

	describe('onChange', () => {
		it('should be touched and not pristine', () => {
			const {
				container: { firstChild: form },
				getByLabelText,
			} = render(
				<Form name="foo" onSubmit={noop}>
					<Field
						id="bar"
						label={labelText}
						name="foo"
					/>
				</Form>
			);

			const input = getByLabelText(labelText);

			fireEvent.change(input, { target: { value: 'qux' } });

			expect(form.hasAttribute('pristine'), 'pristine').to.be.false;
			expect(form.hasAttribute('touched'), 'touched').to.be.true;
		});
	});

	function resetOrSubmitForm(action) {
		const calls = new Set();

		const {
			container: { firstChild: form },
			getByLabelText,
		} = render(
			<Form
				name="foo"
				onReset={() => { calls.add('reset') }}
				onSubmit={() => { calls.add('submit') }}
			>
				<Field
					id="bar"
					label={labelText}
					name="foo"
				/>
			</Form>
		);

		const input = getByLabelText(labelText);

		fireEvent.change(input, { target: { value: 'qux' } });

		expect(form.hasAttribute('pristine'), 'pristine (after change)').to.be.false;
		expect(form.hasAttribute('touched'), 'touched (after change)').to.be.true;

		fireEvent[action](form, {
			target: {
				reportValidity: () => true,
				stopPropagation: noop,
			},
		});

		expect(form.hasAttribute('pristine'), `pristine (after ${action})`).to.be.true;
		expect(form.hasAttribute('touched'), `touched (after ${action})`).to.be.false;
		expect(calls.size, `handler’s called (after ${action})`).to.equal(1);
		expect(calls.has(action), `handler’s called (after ${action})`).to.be.true;
	}

	describe('onReset', () => {
		it('should void initial values, allowing a subsequent submit with the same value(s)', () => {
			const sameSearchValue = 'foo';

			let onResetCalled = 0;
			let onSubmitCalled = 0;
			function onReset() { onResetCalled++ }
			function onSubmit() { onSubmitCalled++ }

			const {
				container: { firstChild: form },
				getByTestId,
			} = render(
				<Form onReset={onReset} onSubmit={onSubmit}>
					<Field data-testid="search" name="q" type="search" />
				</Form>
			);

			const field = getByTestId('search');

			fireEvent.change(field, { target: { value: sameSearchValue } });

			fireEvent.submit(form, { elements: [field] });
			expect(onResetCalled, 'reset count (after submit)').to.equal(0);
			expect(onSubmitCalled, 'submit count').to.equal(1);

			fireEvent.reset(form, { elements: [field] });
			expect(onResetCalled, 'reset count (after reset)').to.equal(1);
			expect(onSubmitCalled, 'submit count').to.equal(1);

			fireEvent.change(field, { target: { value: sameSearchValue } });
			fireEvent.submit(form, { elements: [field] });
			expect(onResetCalled, 'reset count (after subsequent submit)').to.equal(1);
			expect(onSubmitCalled, 'submit count').to.equal(2);
		});

		it('should reset pristine & touched and call handler', () => {
			resetOrSubmitForm('reset');
		});
	});

	describe('onSubmit', () => {
		it('should reset pristine & touched and call handler', () => {
			resetOrSubmitForm('submit');
		});

		it('should provide the correct data onSubmit', () => {
			const dV = {
				__proto__: null,
				age: 30,
				contactDetails: {
					__proto__: null,
					email: 'jakob.jingleheimer@test.dev',
					phones: {
						__proto__: null,
						home: '1111111111',
						mobile: '5555555555',
					},
				},
				names: {
					__proto__: null,
					forename: 'Jakob',
					surname: 'Jingleheimer',
				},
			};
			const nV = {
				__proto__: null,
				age: 31,
				contactDetails: {
					__proto__: null,
					email: 'jakob.jingleheimer+different@test.dev',
					phones: {
						__proto__: null,
						mobile: '7777777777',
					},
				},
			};

			let delta;
			let all;
			let event;

			async function onSubmit(...args) {
				([delta, all, event] = args);
			}

			const {
				container: { firstChild: form },
				getByLabelText,
			} = render(
				<Form name="test" onSubmit={onSubmit}>
					<fieldset name="names">
						<Field
							defaultValue={dV.names.forename}
							label="forename"
							name="forename"
						/>

						<Field
							defaultValue={dV.names.surname}
							label="surname"
							name="surname"
						/>
					</fieldset>

					<Field
						defaultValue={dV.age}
						label="age"
						name="age"
						type="number"
					/>

					<fieldset name="contactDetails">
						<fieldset name="phones">
							<Field
								defaultValue={dV.contactDetails.phones.mobile}
								label="mobile phone number"
								name="mobile"
							/>
							<Field
								defaultValue={dV.contactDetails.phones.home}
								label="home phone number"
								name="home"
							/>
						</fieldset>

						<Field
							defaultValue={dV.contactDetails.email}
							label="email"
							name="email"
							type="email"
						/>
					</fieldset>
				</Form>
			);

			const ageField = getByLabelText('age');
			const emailField = getByLabelText('email');
			const mobileField = getByLabelText('mobile phone number');

			fireEvent.change(ageField, { target: { value: nV.age } });
			fireEvent.change(emailField, { target: { value: nV.contactDetails.email } });
			fireEvent.change(mobileField, { target: { value: nV.contactDetails.phones.mobile } });

			fireEvent.submit(form);

			expect(delta).to.eql(nV);
			expect(all).to.eql({
				__proto__: null,
				age: nV.age,
				contactDetails: {
					__proto__: null,
					email: nV.contactDetails.email,
					phones: {
						__proto__: null,
						home: dV.contactDetails.phones.home,
						mobile: nV.contactDetails.phones.mobile,
					},
				},
				names: dV.names,
			});
			expect(event.type).to.equal('submit');
		});
	});
});
