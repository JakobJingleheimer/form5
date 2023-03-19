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

	it('should reset "pristine" and "touched" when its form is submitted', () => {
		const { container: { firstChild: field } } = render(
			<TestComponent required name="foo" />
		);

		fireEvent.invalid(field);

		fireEvent.change(field, { target: { value: 'bar' } });

		expect(field.hasAttribute('pristine'), '(after change) pristine').to.be.false;
		expect(field.hasAttribute('touched'), '(after change) touched').to.be.true;

		fireEvent.submit(field);

		expect(field.hasAttribute('pristine'), '(after submit) pristine').to.be.true;
		expect(field.hasAttribute('touched'), '(after submit) touched').to.be.false;
	});
})
