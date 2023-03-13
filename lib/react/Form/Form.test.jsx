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
});
