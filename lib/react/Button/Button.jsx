import { clsx } from 'clsx';
import PropTypes from 'prop-types';

import Group from '../Group/Group.jsx';

import styles from './Button.module.css';


export { styles as buttonClasses };

/**
 *
 * @param {object} props
 * @param {APPEARANCE} [props.appearance=Button.APPEARANCES.PRIMARY]
 * @param {ReactNode} props.children
 * @param {string} props.className
 * @param {boolean} [props.fluid=false]
 * @param {ReactNode} props.icon
 * @param {HTMLButtonElement['type']} [props.type=Button.TYPES.BUTTON]
 * @param {VARIANT} [props.variant=Button.VARIANTS.CTA]
 * @param {import('react').HTMLProps<HTMLButtonElement>} props.others
 * @returns {HTMLButtonElement}
 */
export default function Button({
	children: label,
	className,
	fluid,
	icon: Icon,
	...others
}) {
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

Button.displayName = 'Form5Button';

/**
 * @typedef {keyof typeof Button.APPEARANCES} APPEARANCE_KEYS
 * @typedef {typeof Button.APPEARANCES[APPEARANCE_KEYS]} APPEARANCE
 */
Button.APPEARANCES = {
	AFFIRMING: 'affirming',
	BASIC: 'basic',
	DANGER: 'danger',
	PRIMARY: 'primary',
	WARNING: 'warning',
};
/**
 * @typedef {keyof typeof Button.TYPES} VARIANT_KEYS
 * @typedef {typeof Button.TYPES[keyof typeof Button.TYPES]} TYPE
 */
Button.TYPES = {
	BUTTON: 'button',
	RESET: 'reset',
	SUBMIT: 'submit',
};
/**
 * @typedef {keyof typeof Button.VARIANTS} VARIANT_KEYS
 * @typedef {typeof Button.VARIANTS[VARIANT_KEYS]} VARIANT
 */
Button.VARIANTS = {
	CTA: 'cta',
	GLYPH: 'glyph',
};
Button.defaultProps = {
	appearance: Button.APPEARANCES.PRIMARY,
	fluid: false,
	type: Button.TYPES.BUTTON,
	variant: Button.VARIANTS.CTA,
};
Button.propTypes = {
	appearance: PropTypes.oneOf(Object.values(Button.APPEARANCES)),
	fluid: PropTypes.bool,
	type: PropTypes.oneOf(Object.values(Button.TYPES)),
	variant: PropTypes.oneOf(Object.values(Button.VARIANTS)),
};

Button.Group = ({ className, ...props }) => (
	<Group className={clsx(className, styles.ButtonGroup)} {...props} />
);
