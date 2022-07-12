import { fireEvent, render } from '@testing-library/react';

import Input from './index.jsx';


describe('<Input>', () => {
	const labelText = 'foo bar';

	it('should associate field and label', () => {
		const { getByLabelText } = render(
			<Input
				id="bar"
				label={labelText}
				name="foo"
			/>
		);

		const input = getByLabelText(labelText);

		expect(input).to.be.ok;
	});

	it('should accept user-input', () => {
		const { getByLabelText } = render(
			<Input
				id="bar"
				label={labelText}
				name="foo"
			/>
		);

		const input = getByLabelText(labelText);
		const value = 'xyz';

		fireEvent.change(input, { target: { value } });

		expect(input.value).to.equal(value);
	});

	it('should display errors', async () => {
		const { getByLabelText, queryByTestId } = render(
			<Input
				id="bar"
				label={labelText}
				name="foo"
				required
				type="text"
				value="abc"
			/>
		);

		const input = getByLabelText(labelText);

		input.focus();
		expect(queryByTestId('input-error')).to.be.null;

		fireEvent.change(input, { target: { value: '' } });
		input.blur();

		const error = queryByTestId('input-error');
		expect(error).to.not.be.null;
		expect(error.textContent).to.be.not.empty;
	});

	it('should make a list when options are provided', () => {
		const options = {
			'abc-123': 'foo',
			'def-456': 'bar',
		};
		const { queryByTestId } = render(
			<Input
				id="bar"
				label={labelText}
				name="foo"
				options={options}
			/>
		);

		expect(queryByTestId('foo_options')).to.be.not.null;
	});

	describe('event callbacks', () => {
		it('should trigger a provided onBlur handler', () => {
			let onBlurCalledWith;
			const name = 'foo';
			const { getByLabelText } = render(
				<Input
					id="bar"
					label={labelText}
					name={name}
					onBlur={(...args) => onBlurCalledWith = args}
				/>
			);

			const input = getByLabelText(labelText);

			fireEvent.focus(input);
			fireEvent.blur(input);

			expect(onBlurCalledWith.length).to.equal(1);
			expect(onBlurCalledWith[0].type).to.equal('blur');
			expect(onBlurCalledWith[0].target).to.equal(input);
		});

		it('should trigger a provided onChange handler', () => {
			let onChangeCalledWith;
			const name = 'foo';
			const { getByLabelText } = render(
				<Input
					id="bar"
					label={labelText}
					name={name}
					onChange={(...args) => onChangeCalledWith = args}
				/>
			);

			const input = getByLabelText(labelText);
			const value = 'xyz';

			fireEvent.change(input, { target: { value } });

			expect(onChangeCalledWith.length).to.equal(2);
			expect(onChangeCalledWith[0]).to.eql({ name, value });
			expect(onChangeCalledWith[1].type).to.equal('change');
			expect(onChangeCalledWith[1].target).to.equal(input);
		});
	});
});
