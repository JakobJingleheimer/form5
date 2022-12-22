import classnames from 'classnames';
import {
	elementType,
} from 'prop-types';

import styles from './Group.module.css';


const Group = ({
	as: Tag,
	className,
	...others
}) => (
	<Tag
		className={classnames(styles.Group, className)}
		{...others}
	/>
);
Group.defaultProps = {
	as: 'div',
};
Group.propTypes = {
	as: elementType,
};

export default Group;
