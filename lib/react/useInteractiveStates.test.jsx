import { fireEvent, render } from '@testing-library/react';

import { useInteractiveStates } from './useInteractiveStates.js';


describe('useInteractiveStates()', () => {
	function TestComponent({
		onDirty,
		onPristine,
		...others
	}) {
		const interactiveStates = useInteractiveStates({ onDirty, onPristine });

		return (
			<input
				{...others}
				{...interactiveStates}
			/>
		);
	}

	it('should initially mark the field pristine and untouched', () => {
		const { container: { firstChild: field } } = render(
			<TestComponent name="foo" />
		);

		expect(field.hasAttribute('pristine'), 'pristine').to.be.true;
		expect(field.hasAttribute('touched'), 'touched').to.be.false;
	});

	it('should mark the field "touched" AFTER the first time it becomes active/focused', () => {
		const { container: { firstChild: field } } = render(
			<TestComponent name="foo" />
		);

		fireEvent.blur(field);

		expect(field.hasAttribute('pristine'), 'pristine').to.be.true;
		expect(field.hasAttribute('touched'), 'touched').to.be.true;
	});

	it('should remove "pristine" as soon as the field value changes (and mark it "touched")', () => {
		const { container: { firstChild: field } } = render(
			<TestComponent name="foo" />
		);

		fireEvent.change(field, { target: { value: 'bar' } });

		expect(field.hasAttribute('pristine'), 'pristine').to.be.false;
		expect(field.hasAttribute('touched'), 'touched').to.be.true;
	});

	it('should mark the field touched if it is not already and becomes invalid', () => {
		const { container: { firstChild: field } } = render(
			<TestComponent required name="foo" />
		);

		fireEvent.invalid(field);

		expect(field.hasAttribute('pristine'), 'pristine').to.be.true;
		expect(field.hasAttribute('touched'), 'touched').to.be.true;
	});

	describe('onSubmit', () => {
		it('should reset "pristine" & "touched" and call handlers', () => {
			const calls = new Map();
			function onDirty(...args) { calls.set('onDirty', args); }
			function onPristine(...args) { calls.set('onPristine', args); }

			const { container: { firstChild: field } } = render(
				<TestComponent
					name="foo"
					onDirty={onDirty}
					onPristine={onPristine}
				/>
			);

			fireEvent.change(field, { target: { value: 'bar' } });

			expect(field.hasAttribute('pristine'), '(after change) pristine').to.be.false;
			expect(field.hasAttribute('touched'), '(after change) touched').to.be.true;
			expect(calls.size, 'callback count after change').to.equal(1);
			expect(calls.get('onDirty'), 'onDirty called after change').to.deep.equal([true]);

			calls.clear();

			fireEvent.submit(field);

			expect(field.hasAttribute('pristine'), 'pristine (after submit)').to.be.true;
			expect(field.hasAttribute('touched'), 'touched (after submit)').to.be.false;
			expect(calls.size, 'callback count (after submit)').to.equal(1);
			expect(calls.get('onPristine'), 'onPristine called (after submit)').to.deep.equal([false]);
		});
	});
})
