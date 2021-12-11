import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './Button.module.css';


const Button = ({
	children: label,
	className,
	fluid,
	icon: Icon,
	...others
}) => (
	<button
		{...others}
		className={classnames(
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
Button.APPEARANCES = {
	AFFIRMING: 'affirming',
	BASIC: 'basic',
	DANGER: 'danger',
	PRIMARY: 'primary',
	WARNING: 'warning',
};
Button.TYPES = {
	BUTTON: 'button',
	SUBMIT: 'submit',
};
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
	<Group className={classnames(className, styles.ButtonGroup)} {...props} />
);

export default Button;
