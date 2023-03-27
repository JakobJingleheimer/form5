import { fireEvent, render } from '@testing-library/react';

import Input from '../Input/Input.jsx';
import Form from './Form.jsx';


describe('<Form>', () => {
	const labelText = 'foo bar';
	function noop() {}

	it('should initially be pristine and untouched', () => {
		const { container: { firstChild: form } } = render(
			<Form name="foo" onSubmit={noop} />
		);

		expect(form.hasAttribute('pristine'), 'pristine').to.be.true;
		expect(form.hasAttribute('touched'), 'touched').to.be.false;
	});

	it('should be touched after a field is blurred', () => {
		const {
			container: { firstChild: form },
			getByLabelText,
		} = render(
			<Form name="foo" onSubmit={noop}>
				<Input
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

	it('should be touched and not pristine after a field is changed', () => {
		const {
			container: { firstChild: form },
			getByLabelText,
		} = render(
			<Form name="foo" onSubmit={noop}>
				<Input
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

	it('should reset pristine and untouched after submit', () => {
		const {
			container: { firstChild: form },
			getByLabelText,
		} = render(
			<Form name="foo" onSubmit={noop}>
				<Input
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

		fireEvent.submit(form, {
			target: {
				reportValidity: () => true,
				stopPropagation: noop,
			},
		});

		expect(form.hasAttribute('pristine'), 'pristine').to.be.true;
		expect(form.hasAttribute('touched'), 'touched').to.be.false;
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

		async function expectSubmit(...args) {
			([delta, all] = args);
		}

		const {
			container: { firstChild: form },
			getByLabelText,
		} = render(
			<Form name="test" onSubmit={expectSubmit}>
				<fieldset name="names">
					<Input
						defaultValue={dV.names.forename}
						label="forename"
						name="forename"
					/>

					<Input
						defaultValue={dV.names.surname}
						label="surname"
						name="surname"
					/>
				</fieldset>

				<Input
					defaultValue={dV.age}
					label="age"
					name="age"
					type="number"
				/>

				<fieldset name="contactDetails">
					<fieldset name="phones">
						<Input
							defaultValue={dV.contactDetails.phones.mobile}
							label="mobile phone number"
							name="mobile"
						/>
						<Input
							defaultValue={dV.contactDetails.phones.home}
							label="home phone number"
							name="home"
						/>
					</fieldset>

					<Input
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
	});
});
