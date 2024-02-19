import { clsx } from 'clsx';

import styles from './Group.module.css';


export { styles as grouptClasses };

/**
 * @typedef {import('react')} React
 */

/**
 * @typedef {object} GroupProps
 * @property {React.ElementType} [props.as] The element to render.
 * @property {React.ReactNode} FormProps.children
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

Group.displayName = /** @type {const} */ ('Form5Group');
