import _reduce from 'lodash-es/reduce.js';

import { clsx } from 'clsx';
import { memo, useRef } from 'react';
import PropTypes from 'prop-types';

import composeData, {
	FIELD_TAGS,
} from '../../composeData.js';
import deepDiff from '../../deepDiff.js';
import { useInteractiveStates } from '../useInteractiveStates.js';

import styles from './Form.module.css';


export { styles as formClasses };

/**
 * @typedef {import('../../composeData.js').ComposedData} ComposedData
 */
/**
 * @typedef {import('react').FormEvent<HTMLFormElement>} SubmitEvent
 */
/**
 * @typedef {import('react').FormEvent<HTMLFormElement>} ResetEvent
 */
/**
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} props.className
 * @param {(isDirty: true) => void} props.onDirty
 * @param {(isDirty: false) => void} props.onPristine
 * @param {import('react').onReset} props.onReset
 * @param {(delta: ComposedData, all: ComposedData, event: SubmitEvent) => void} props.onSubmit
 * `delta` is the difference between the initial values and the current values. `all` is the same
 * shape, but containing the full current values. `event` is the original submit event.
 * @returns {HTMLFormElement}
 */
export function Form({
	children,
	className,
	onDirty,
	onPristine,
	...props
}) {
	const formElm = useRef();
	const initValues = useRef(); // `useRef` to avoid needless re-renders
	const {
		pristine,
		touched,
		...is
	} = useInteractiveStates({ onDirty, onPristine });

	// form needs an `id` for buttons that live outside it in the DOM: `<button form={form.id}>`
	props.id ||= props.name;

	return (
		<form
			{...props}
			className={clsx(styles.Form, className)}
			noValidate
			onBlur={(e) => {
				if (e.target.form === formElm.current) {
					is.onBlur(e); // We only care when the blur bubbled from a field
				}
			}}
			onChange={is.onChange}
			onReset={(e) => {
				props.onReset?.(e);
				is.onSubmit(e);
			}}
			onSubmit={(e) => {
				onSubmit(e, initValues, props.onSubmit);
				// After everything has succeeded
				is.onSubmit(e);
			}}
			ref={(el) => {
				setup(el, initValues);
				formElm.current = el;
			}}
			pristine={pristine}
			touched={touched}
		>
			{children}
		</form>
	);
}

Form.FIELD_TAGS = FIELD_TAGS;

Form.displayName = 'Form5Form';
Form.propTypes = {
	onDirty: PropTypes.func,
	onPristine: PropTypes.func,
	onSubmit: PropTypes.func.isRequired,
};

export default memo(Form);

// Exported for testing
export function onSubmit(event, initValues, cb) {
	event.preventDefault();

	if (!event.target.reportValidity()) return;

	event.stopPropagation();

	const all = _reduce(
		Array.from(event.target.elements),
		composeData,
		{ __proto__: null },
	);

	const delta = deepDiff(initValues.current, all);

	if (!Object.keys(delta).length) return;

	initValues.current = all; // reset starting values for potential subsequent submit

	return cb(delta, all, event);
}

// Exported for testing
export function setup(formElement, initValues) {
	if (!formElement || initValues.current) return;

	initValues.current = _reduce(
		Array.from(formElement.elements),
		composeData,
		{ __proto__: null },
	);
};
