import { clsx } from 'clsx';
import _isEmpty from 'lodash-es/isEmpty.js';
import _map from 'lodash-es/map.js';
import { useState } from 'react';

import { useInteractiveStates } from '../useInteractiveStates.js';

import Button from '../Button/Button.jsx';
import buttonStyles from '../Button/Button.module.css';

import styles from './Field.module.css';


export { styles as inputClasses };

/**
 * @typedef {import('react')} React
 */

/**
 * @typedef {object} FieldProps
 * @property {import('../Button/Button.jsx').Appearance} [FieldProps.appearance=Button.APPEARANCES.PRIMARY]
 * @property {Arrangement} [FieldProps.arrangement=Field.ARRANGEMENTS.INLINE]
 * @property {React.ElementType} [FieldProps.as='input'] The element to render.
 * @property {HTMLElement['className']} [FieldProps.className]
 * @property {boolean} [FieldProps.fluid] Whether the field should fill its container.
 * @property {HTMLElement['id']} [FieldProps.id]
 * @property {HTMLLabelElement['textContent']} FieldProps.label
 * @property {HTMLInputElement['name']} FieldProps.name
 * @property {(event: React.FocusEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => void} FieldProps.onBlur
 * @property {(change: { id: string, name: string, value: boolean | number | string }, event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => void} FieldProps.onChange
 * @property {Array<{ [key: HTMLOptionElement['value']]: HTMLOptionElement['textContent'] }>} FieldProps.options
 * @property {HTMLInputElement['readOnly']} [FieldProps.readOnly]
 * @property {HTMLInputElement['required']} [FieldProps.required]
 * @property {HTMLInputElement['type']} [FieldProps.type='text']
 * @property {Variant} [FieldProps.variant]
 * @property {React.HTMLProps<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} [FieldProps.others]
 */

/**
 * @param {FieldProps} props
 */
export default function Field({
	appearance = Button.APPEARANCES.PRIMARY,
	arrangement = Field.ARRANGEMENTS.INLINE,
	as: Tag = 'input',
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
	type = 'text',
	variant,
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
	if (Tag === 'textarea') {
		others.rows ??= 3;
		type = null;
	}

	others.onBlur = (e) => {
		if (readOnly) return;

		is.onBlur(e);

		onBlur?.(e);

		if (e.target.checkValidity()) setError('');
	};

	others.onChange = (e) => {
		if (readOnly) {
			// ! Contrary to what anyone would want, `readonly` does NOT affect checkboxes or radio buttons
			// ! because `readonly` prevents `value` being changed, they use `checked` not  `value`.
			e.preventDefault();
			// These stop*Propagations are necessary to prevent <Form> pristine/touched being updated
			e.stopPropagation(); // Prevent other handlers registered via React being called
			e.nativeEvent.stopImmediatePropagation(); // Prevent other handlers registered not via React being called
			return false;
		}

		is.onChange(e);

		let {
			checked,
			id,
			name,
			type,
			value,
		} = e.target;

		if (type === 'checkbox') value = checked;

		onChange?.({
			id,
			name,
			value: options?.[value] ?? value,
		}, e);

		if (isInvalid && e.target.checkValidity()) setError('');
	};

	const isButton = buttonVariants.has(variant);
	const isSwitch = switchTypes.has(type);
	const isSearch = type === "search";

	if (isSearch) arrangement = Field.ARRANGEMENTS.COMPACT;

	if (others.value === null) others.value = ''; // React has a tantrum when `value` is `null`

	return (
		<div
			arrangement={arrangement}
			className={clsx(
				styles.FieldContainer,
				{
					[styles.Fluid]: fluid,
					[buttonStyles.Button]: isButton,
				},
			)}
			pristine={pristine}
			switch={isSwitch ? '' : null}
			touched={touched}
			{...isButton && {
				variant,
			}}
		>
			<Tag
				className={clsx(styles.Field, className)}
				name={name}
				id={id}
				onInvalid={(e) => {
					e.nativeEvent.stopImmediatePropagation();
					setError(e.target.validationMessage);
					is.onInvalid(e);
				}}
				readOnly={readOnly}
				required={required}
				type={type}
				variant={variant}
				{...others}
			/>

			{isSearch && (
				<>
					<Button
						appearance={Button.APPEARANCES.BASIC}
						className={styles.SearchSubmit}
						disabled={others.disabled}
						readOnly={readOnly}
						type={Button.TYPES.SUBMIT}
						variant={Button.VARIANTS.GLYPH}
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" style={{ height: "0.8em" }}><path d="M6.663 0C2.991 0 0 2.991 0 6.663s2.991 6.663 6.663 6.663a6.628 6.628 0 0 0 4.213-1.508l3.978 3.979a.667.667 0 1 0 .943-.943l-3.978-3.978a6.628 6.628 0 0 0 1.507-4.213C13.326 2.991 10.336 0 6.663 0Zm0 1.333a5.32 5.32 0 0 1 5.33 5.33 5.32 5.32 0 0 1-5.33 5.33 5.32 5.32 0 0 1-5.33-5.33 5.32 5.32 0 0 1 5.33-5.33Z"/></svg>
					</Button>

					<Button
						appearance={Button.APPEARANCES.BASIC}
						className={styles.SearchReset}
						disabled={others.disabled}
						readOnly={readOnly}
						type={Button.TYPES.RESET}
						variant={Button.VARIANTS.GLYPH}
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" style={{ height: "0.8em" }}><path d="M13.162 2.326a.5.5 0 0 0-.349.154L8 7.293 3.187 2.48a.5.5 0 1 0-.707.707L7.293 8 2.48 12.813a.499.499 0 1 0 .707.707L8 8.707l4.813 4.813a.5.5 0 1 0 .707-.707L8.707 8l4.813-4.813a.5.5 0 0 0-.358-.86Z"/></svg>
					</Button>
				</>
			)}

			{(!!label || isInvalid) && (
				<div className={styles.InnerWrapper}>
					{!!label && (
						<label
							className={clsx(styles.Label, {
								[buttonStyles.Button]: isButton,
							})}
							htmlFor={id}
							{...isButton && {
								appearance,
								variant,
							}}
						>
							{label}
						</label>
					)}

					{isInvalid && (
						<dialog
							className={styles.Error}
							data-testid="field-error"
							open
						>
							{error}
						</dialog>
					)}
				</div>
			)}

			{!_isEmpty(options) && (
				<datalist data-testid={others.list} id={others.list}>{_map(options, (label, key) => (
					<option key={key} value={key}>{label}</option>
				))}</datalist>
			)}
		</div>
	);
};

Field.displayName = /** @type {const} */ ('Form5Field');

/**
 * @typedef {typeof Field.ARRANGEMENTS[keyof typeof Field.ARRANGEMENTS]} Arrangement
 */
Field.ARRANGEMENTS = /** @type {const} */ ({
	COMPACT: 'compact',
	INLINE: 'inline',
	STACKED: 'stacked',
	STAND_ALONE: 'stand-alone',
});
/**
 * @typedef {typeof Field.VARIANTS[keyof typeof Field.VARIANTS]} Variant
 */
Field.VARIANTS = /** @type {const} */ ({
	CTA: Button.VARIANTS.CTA,
	GLYPH: Button.VARIANTS.GLYPH,
	TOGGLE: 'toggle',
});

const dtTypes = new Set([
	'date',
	'datetime',
	'datetime-local',
	'time',
]);

const buttonVariants = new Set([
	Field.VARIANTS.CTA,
	Field.VARIANTS.GLYPH,
]);

const switchTypes = new Set([
	'checkbox',
	'color',
	'radio',
]);
