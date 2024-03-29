import { cleanup, fireEvent, render } from '@testing-library/react';

import Field from './Field.jsx';


describe('<Field>', () => {
	const labelText = 'foo bar';

	it('should associate field and label', () => {
		const { getByLabelText } = render(
			<Field
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
			<Field
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
			<Field
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
				<Field
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
			expect(queryByTestId('field-error')).to.be.null;
		});

		it('should NOT display an error on focus', () => {
			fireEvent.focus(input);
			expect(queryByTestId('field-error')).to.be.null;
		});

		it('should NOT display an error on change', () => {
			fireEvent.change(input, { target: { value: '' } });
			expect(queryByTestId('field-error')).to.be.null;
		});

		function triggerErrorDisplay() {
			fireEvent.change(input, { target: { value: '' } });
			fireEvent.blur(input);

			return queryByTestId('field-error');
		}

		it('should display an error on blur', () => {
			const error = triggerErrorDisplay();
			expect(error.textContent).to.be.not.empty;
		});

		it('should clear the error on subsequent change', () => {
			triggerErrorDisplay();

			fireEvent.change(input, { target: { value: 'jakob@example.com' } });

			expect(queryByTestId('field-error')).to.be.null;
		});
	});

	it('should make a list when options are provided', () => {
		const options = {
			'abc-123': 'foo',
			'def-456': 'bar',
		};
		const { queryByTestId } = render(
			<Field
				id="bar"
				label={labelText}
				name="foo"
				options={options}
			/>
		);

		expect(queryByTestId('foo_options')).to.be.not.null;
	});

	describe('element variations', () => {
		it('should respect `as`', () => {
			const select = render(
				<Field
					as="select"
					id="bar"
					label={labelText}
					name="foo"
				/>
			)
			.getByLabelText(labelText);

			expect(select.tagName).to.equal('SELECT');

			cleanup();

			const textarea = render(
				<Field
					as="textarea"
					id="bar"
					label={labelText}
					name="foo"
				/>
			)
			.getByLabelText(labelText);

			expect(textarea.tagName).to.equal('TEXTAREA');
		});

		it.skip('should use checkbox state as value', () => {
			let onChangeCalledWith;
			const input = render(
				<Field
					id="bar"
					label={labelText}
					name="foo"
					onChange={(...args) => onChangeCalledWith = args}
					type="checkbox"
				/>
			).getByLabelText(labelText);

			// FIXME: fireEvent.change does not trigger on checkbox
			fireEvent.change(input, { target: { checked: true } });

			console.log('onChangeCalledWith:', onChangeCalledWith)

			expect(onChangeCalledWith[0].value).to.be.true;
		});

		describe('`variant`', () => {
			it('should appear as `cta`', () => {
				const input = render(
					<Field
						id="bar"
						label={labelText}
						name="foo"
						variant="cta"
					/>
				)
				.getByLabelText(labelText);

				expect(input.getAttribute('variant')).to.equal('cta');
			});

			it('should appear as `toggle`', () => {
				const input = render(
					<Field
						id="bar"
						label={labelText}
						name="foo"
						type="checkbox"
						variant="toggle"
					/>
				)
				.getByLabelText(labelText);

				expect(input.getAttribute('variant')).to.equal('toggle');
			});
		});

		describe('textarea', () => {
			it('should set a default number of `rows`', () => {
				const { getByLabelText } = render(
					<Field
						as="textarea"
						id="bar"
						label={labelText}
						name="foo"
					/>
				);

				const field = getByLabelText(labelText);

				expect(field.rows).to.equal(3);
			});
		});
	});

	describe('event callbacks', () => {
		it('should trigger a provided onBlur handler', () => {
			let onBlurCalledWith;
			const name = 'foo';
			const input = render(
				<Field
					id="bar"
					label={labelText}
					name={name}
					onBlur={(...args) => onBlurCalledWith = args}
				/>
			)
			.getByLabelText(labelText);

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
			const input = render(
				<Field
					id={id}
					label={labelText}
					name={name}
					onChange={(...args) => onChangeCalledWith = args}
				/>
			).getByLabelText(labelText);
			const value = 'xyz';

			fireEvent.change(input, { target: { value } });

			expect(onChangeCalledWith.length).to.equal(2);
			expect(onChangeCalledWith[0]).to.eql({ name, id, value });
			expect(onChangeCalledWith[1].type).to.equal('change');
			expect(onChangeCalledWith[1].target).to.equal(input);
		});

		describe('when readonly', () => {
			it('should prevent blur events', () => {
				let onBlurCalled;

				const input = render(
					<Field
						id="bar"
						label={labelText}
						name="foo"
						onBlur={(...args) => onBlurCalled = true}
						readOnly
					/>
				)
				.getByLabelText(labelText);

				fireEvent.blur(input);

				expect(onBlurCalled).to.be.undefined;
			});

			it('should prevent change actions', () => {
				let onChangeCalled;
				let preventDefaultCalled;
				let stopImmediatePropagationCalled;
				let stopPropagationCalled;

				const input = render(
					<Field
						id="bar"
						label={labelText}
						name="foo"
						onChange={(...args) => onChangeCalled = true}
						readOnly
					/>
				)
				.getByLabelText(labelText);

				const value = 'xyz';

				fireEvent.change(input, {
					nativeEvent: {
						stopImmediatePropagation: () => stopImmediatePropagationCalled = true,
					},
					preventDefault: () => preventDefaultCalled = true,
					stopPropagation: () => stopPropagationCalled = true,
					target: { value },
				});

				expect(onChangeCalled).to.be.undefined;
				expect(preventDefaultCalled).to.be.undefined;
				expect(stopImmediatePropagationCalled).to.be.undefined;
				expect(stopPropagationCalled).to.be.undefined;
			});
		});
	});
});
