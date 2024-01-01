import { clsx } from 'clsx';

import Group from '../Group/Group.jsx';

import styles from './Button.module.css';


export { styles as buttonClasses };

/**
 * @typedef {import('react')} React
 */

/**
 *
 * @param {object} props
 * @param {Appearance} [props.appearance=Button.APPEARANCES.PRIMARY]
 * @param {React.ReactNode} [props.children]
 * @param {HTMLElement['className']} [props.className]
 * @param {boolean} [props.fluid=false]
 * @param {React.ReactNode} [props.icon]
 * @param {HTMLButtonElement['type']} [props.type=Button.TYPES.BUTTON]
 * @param {Variant} [props.variant=Button.VARIANTS.CTA]
 * @param {React.HTMLProps<HTMLButtonElement>} [props.others]
 */
export default function Button({
	appearance = Button.APPEARANCES.PRIMARY,
	children: label,
	className,
	fluid,
	icon: Icon,
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
			{!!Icon
				? Icon
				: label
			}
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

Button.Group = ({ className, ...props }) => (
	<Group className={clsx(className, styles.ButtonGroup)} {...props} />
);
