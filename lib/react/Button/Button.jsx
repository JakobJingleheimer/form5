import { clsx } from 'clsx';

import Group from '../Group/Group.jsx';

import styles from './Button.module.css';


export { styles as buttonClasses };

/**
 * @typedef {import('react')} React
 */

/**
 * @typedef {object} ButtonProps
 * @property {Appearance} [ButtonProps.appearance=Button.APPEARANCES.PRIMARY]
 * @property {boolean} [ButtonProps.disabled]
 * @property {React.ReactNode} [ButtonProps.children]
 * @property {boolean} [ButtonProps.fluid=false]
 * @property {HTMLButtonElement['type']} [ButtonProps.type=Button.TYPES.BUTTON]
 * @property {Variant} [ButtonProps.variant=Button.VARIANTS.CTA]
 */

/**
 * @param {ButtonProps & React.BaseHTMLAttributes} props
 */
export default function Button({
	appearance = Button.APPEARANCES.PRIMARY,
	children: label,
	className,
	fluid,
	type = Button.TYPES.BUTTON,
	variant = Button.VARIANTS.CTA,
	...others
}) {
	Object.assign(others, { appearance, type, variant });
	return (
		<button
			{...others}
			className={clsx(
				styles.Button,
				className,
				{
					[styles.fluid]: fluid,
				},
			)}
		>
			{label}
		</button>
	);
}

Button.displayName = /** @type {const} */ ('Form5Button');

/**
 * @typedef {typeof Button.APPEARANCES[keyof typeof Button.APPEARANCES]} Appearance
 */
Button.APPEARANCES = /** @type {const} */ ({
	AFFIRMING: 'affirming',
	BASIC: 'basic',
	DANGER: 'danger',
	PRIMARY: 'primary',
	WARNING: 'warning',
});
/**
 * @typedef {typeof Button.TYPES[keyof typeof Button.TYPES]} Type
 */
Button.TYPES = /** @type {const} */ ({
	BUTTON: 'button',
	RESET: 'reset',
	SUBMIT: 'submit',
});
/**
 * @typedef {typeof Button.VARIANTS[keyof typeof Button.VARIANTS]} Variant
 */
Button.VARIANTS = /** @type {const} */ ({
	CTA: 'cta',
	GLYPH: 'glyph',
});

/**
 * @param {import('../Group/Group.jsx').GroupProps & React.HTMLAttributes<HTMLElement>} props
 */
Button.Group = ({ className, ...props }) => (
	<Group className={clsx(className, styles.ButtonGroup)} {...props} />
);
