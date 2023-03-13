import { fireEvent, render } from '@testing-library/react';

import Input from './Input.jsx';


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

	it('should avoid obnoxious react noise about uncontrolled to controlled fields', () => {
		const globalConsoleErr = console.error;
		const calls = new Array();
		global.console.error = function MOCK_consoleError(...args) { calls.push(args) }

		render(
			<Input
				id="bar"
				label={labelText}
				name="foo"
				value={null}
			/>
		);

		expect(calls.length).to.equal(0);

		global.console.error = globalConsoleErr;
	});

	describe('displaying errors', () => {
		let getByLabelText;
		let queryByTestId;
		let input;

		beforeEach(() => {
			({ getByLabelText, queryByTestId } = render(
				<Input
					id="bar"
					label={labelText}
					name="foo"
					required
					type="email"
					value="abc"
				/>
			));
			input = getByLabelText(labelText);
		});

		it('should NOT display an error initially', () => {
			expect(queryByTestId('input-error')).to.be.null;
		});

		it('should NOT display an error on focus', () => {
			fireEvent.focus(input);
			expect(queryByTestId('input-error')).to.be.null;
		});

		it('should NOT display an error on change', () => {
			fireEvent.change(input, { target: { value: '' } });
			expect(queryByTestId('input-error')).to.be.null;
		});

		function triggerErrorDisplay() {
			fireEvent.change(input, { target: { value: '' } });
			fireEvent.blur(input);

			return queryByTestId('input-error');
		}

		it('should display an error on blur', () => {
			const error = triggerErrorDisplay();
			expect(error.textContent).to.be.not.empty;
		});

		it('should clear the error on subsequent change', () => {
			triggerErrorDisplay();

			fireEvent.change(input, { target: { value: 'jakob@example.com' } });

			expect(queryByTestId('input-error')).to.be.null;
		});
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
			const id = 'bar';
			const name = 'foo';
			const { getByLabelText } = render(
				<Input
					id={id}
					label={labelText}
					name={name}
					onChange={(...args) => onChangeCalledWith = args}
				/>
			);

			const input = getByLabelText(labelText);
			const value = 'xyz';

			fireEvent.change(input, { target: { value } });

			expect(onChangeCalledWith.length).to.equal(2);
			expect(onChangeCalledWith[0]).to.eql({ name, id, value });
			expect(onChangeCalledWith[1].type).to.equal('change');
			expect(onChangeCalledWith[1].target).to.equal(input);
		});
	});
});
