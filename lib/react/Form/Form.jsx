import _reduce from 'lodash-es/reduce.js';

import classNames from 'classnames';
import { memo, useRef } from 'react';
import PropTypes from 'prop-types';

import composeData, {
	FIELD_TAGS,
} from '../../composeData.js';
import deepDiff from '../../deepDiff.js';
import { useInteractiveStates } from '../useInteractiveStates.js';

import styles from './Form.module.css';


export { styles as formClasses };

export function Form({
	children,
	className,
	onDirty,
	onPristine,
	onSubmit: pOnSubmit,
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
			className={classNames(styles.Form, className)}
			noValidate
			onBlur={(e) => {
				if (e.target.form === formElm.current) {
					is.onBlur(e); // We only care when the blur bubbled from a field
				}
			}}
			onChange={is.onChange}
			onSubmit={(e) => {
				onSubmit(e, initValues, pOnSubmit);
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

	const values = _reduce(
		Array.from(event.target.elements),
		composeData,
		{ __proto__: null },
	);

	const delta = deepDiff(initValues.current, values);

	initValues.current = values; // reset starting values for potential subsequent submit

	return cb(delta, values, event);
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
