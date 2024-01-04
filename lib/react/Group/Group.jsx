import { clsx } from 'clsx';

import styles from './Group.module.css';


export { styles as grouptClasses };

/**
 * @typedef {import('react')} React
 */

/**
 * @typedef {object} GroupProps
 * @extends React.AllHTMLAttributes
 * @property {React.ElementType} [props.as] The element to render.
 * @property {HTMLElement['className']} [props.className]
 */
/**
 * Visually group form elements (buttons) together.
 * @param {GroupProps & React.HTMLAttributes<HTMLElement>} props
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
