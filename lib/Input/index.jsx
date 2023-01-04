import classnames from 'classnames';
import _isEmpty from 'lodash-es/isEmpty.js';
import _map from 'lodash-es/map.js';
import PropTypes from 'prop-types';
import { useState } from 'react';

import styles from './Input.module.css';


export default function Input({
	arrangement,
	as: Field,
	className,
	fluid,
	label,
	name,
	id = name, // must come after `name`
	onBlur,
	onChange,
	onFocus,
	options,
	readOnly,
	required,
	type,
	value,
	...others
}) {
	const [error, setError] = useState('');
	const [pristine, setPristine] = useState(true);
	const [touched, setTouched] = useState(false);
	const isInvalid = !!error;

	if (options) others.list = `${name}_options`;

	others.onBlur = (e) => {
		if (readOnly) return;

		setTouched(true);

		onBlur(e);

		if (e.target.checkValidity()) setError('');
	};

	others.onChange = (e) => {
		if (readOnly) return;

		setPristine(false);
		setTouched(true);

		let {
			checked,
			name,
			type,
			value,
		} = e.target;

		if (type === 'checkbox') value = checked;

		onChange({
			name,
			value: options?.[value] || value,
		}, e);

		if (isInvalid && e.target.checkValidity()) setError('');
	}

	others.onFocus = (e) => {
		if (dtTypes.has(type)) e.target.showPicker();

		onFocus(e);
	}

	const sharedConstraints = {
		readOnly,
		required,
	};

	return (
		<div
			arrangement={arrangement}
			className={classnames(
				styles.InputField,
				{
					[styles.FluidInputField]: fluid,
				},
			)}
			invalid={isInvalid ? '' : null}
			{...sharedConstraints}
			pristine={pristine ? '' : null}
			touched={touched ? '' : null}
		>
			<div className={styles.InnerWrapper}>
				<Field
					className={styles.Input}
					name={name}
					id={id}
					onInvalid={(e) => {
						e.nativeEvent.stopImmediatePropagation();
						setError(e.target.validationMessage);
						setTouched(true);
					}}
					{...sharedConstraints}
					type={type}
					value={value}
					{...others}
				/>
				{isInvalid && (
					<dialog
						className={styles.Error}
						data-testid="input-error"
						open
					>{error}</dialog>
				)}
			</div>
			{!!label && (<label
				className={styles.Label}
				htmlFor={id}
			>{label}</label>)}
			{!_isEmpty(options) && (
				<datalist data-testid={others.list} id={others.list}>{_map(options, (label, key) => (
					<option key={key} value={key}>{label}</option>
				))}</datalist>
			)}
		</div>
	);
};

Input.displayName = 'Form5Input';

Input.ARRANGEMENTS = {
	INLINE: 'inline',
	STACKED: 'stacked',
	STAND_ALONE: 'stand-alone',
};
Input.VARIANTS = {
	TOGGLE: 'toggle',
};
Input.defaultProps = {
	arrangement: Input.ARRANGEMENTS.INLINE,
	as: 'input',
	onBlur() {},
	onChange() {},
	onFocus() {},
	type: 'text',
};
Input.propTypes = {
	arrangement: PropTypes.oneOf(Object.values(Input.ARRANGEMENTS)),
	as: PropTypes.elementType,
	fluid: PropTypes.bool,
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
	onBlur: PropTypes.func,
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	options: PropTypes.object,
	variant: PropTypes.oneOf(Object.values(Input.VARIANTS)),
};

const dtTypes = new Set([
	'date',
	'datetime',
	'datetime-local',
	'time',
]);
