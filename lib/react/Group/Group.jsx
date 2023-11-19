import { clsx } from 'clsx';
import PropTypes from 'prop-types';

import styles from './Group.module.css';


export { styles as grouptClasses };

/**
 * Visually group form elements (buttons) together.
 * @param {object} props
 * @param {import('react').ElementType} props.as The element to render.
 * @param {HTMLElement['className']} props.className
 */
export default function Group({
	as: Tag = 'div',
	className,
	...others
}) {
	return (
		<Tag
			{...others}
			className={clsx(styles.Group, className)}
			role="group"
		/>
	);
}

Group.displayname = 'Form5Group';
Group.propTypes = {
	as: PropTypes.elementType,
};
