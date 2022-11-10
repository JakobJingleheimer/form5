import _reduce from 'lodash-es/reduce.js';

import classNames from 'classnames';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import composeData, {
	FIELD_TAGS,
} from '../composeData.js';
import deepDiff from '../deepDiff.js';

import styles from './Form.module.css';


export default class Form extends PureComponent {
	static FIELD_TAGS = FIELD_TAGS;

	initValues = { __proto__: null };

	setRef = (el) => {
		if (!el) return;

		this.initValues = _reduce(
			[...el.elements],
			composeData,
			this.initValues,
		);
	};

	onSubmit = (event, initValues, cb) => {
		event.preventDefault();

		if (!event.target.reportValidity()) return;

		event.stopPropagation();

		const values = _reduce(
			[...event.target.elements],
			composeData,
			{ __proto__: null },
		);

		const delta = deepDiff(initValues, values);

		this.initValues = values; // reset starting values for potential subsequent submit

		return cb(delta, values, event);
	};

	render() {
		const {
			onSubmit,
			initValues,
			props: {
				children,
				className,
				onSubmit: pOnSubmit,
				...props
			},
			setRef,
		} = this;

		return (
			<form
				{...props}
				className={classNames(styles.Form, className)}
				noValidate
				onSubmit={(e) => onSubmit(e, initValues, pOnSubmit)}
				ref={setRef}
			>
				{children}
			</form>
		);
	}
}

Form.displayName = 'Form5Form';

Form.propTypes = {
	onSubmit: PropTypes.func.isRequired,
};
