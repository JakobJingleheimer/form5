import classnames from 'classnames';
import _isEmpty from 'lodash-es/isEmpty.js';
import _map from 'lodash-es/map.js';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { useInteractiveStates } from '../useInteractiveStates.js';

import styles from './Input.module.css';


export default function Input({
	arrangement,
	as: Field,
	className,
	fluid,
	id,
	label,
	name,
	onBlur,
	onChange,
	options,
	readOnly,
	required,
	type,
	value,
	...others
}) {
	const [error, setError] = useState('');
	const {
		pristine,
		touched,
		...is
	} = useInteractiveStates();
	const isInvalid = !!error;

	id ||= name;

	if (options) others.list = `${name}_options`;

	others.onBlur = (e) => {
		if (readOnly) return;

		is.onBlur(e);

		onBlur(e);

		if (e.target.checkValidity()) setError('');
	};

	others.onChange = (e) => {
		if (readOnly) return;

		is.onChange(e);

		let {
			checked,
			name,
			type,
			value,
		} = e.target;

		if (type === 'checkbox') value = checked;

		onChange({
			name,
			value: options?.[value] ?? value,
		}, e);

		if (isInvalid && e.target.checkValidity()) setError('');
	};

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
			pristine={pristine}
			touched={touched}
		>
			<div className={styles.InnerWrapper}>
				<Field
					className={styles.Input}
					name={name}
					id={id}
					onInvalid={(e) => {
						e.nativeEvent.stopImmediatePropagation();
						setError(e.target.validationMessage);
						is.onInvalid(e);
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
	options: PropTypes.object,
	variant: PropTypes.oneOf(Object.values(Input.VARIANTS)),
};

const dtTypes = new Set([
	'date',
	'datetime',
	'datetime-local',
	'time',
]);
