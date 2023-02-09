import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './Group.module.css';


export { styles as grouptClasses };

export default function Group({
	as: Tag = 'div',
	className,
	...others
}) {
	return (
		<Tag
			{...others}
			className={classnames(styles.Group, className)}
		/>
	);
}

Group.displayname = 'Form5Group';
Group.propTypes = {
	as: PropTypes.elementType,
};
