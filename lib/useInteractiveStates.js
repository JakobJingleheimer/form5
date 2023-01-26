import { useState } from 'react';


/**
 *
 * @returns A collection of event handlers and states (whose values are either an empty string when
 * true, or `null` when false—because React).
 */
export function useInteractiveStates() {
	const [pristine, setPristine] = useState('');
	const [touched, setTouched] = useState(null);

	const onBlur = (e) => {
		setTouched('');
	};
	const onChange = (e) => {
		setPristine(null);
		setTouched('');
	};
	const onInvalid = (e) => {
		setTouched('');
	};
	const onSubmit = (e) => {
		setPristine('');
		setTouched(null);
	};

	return {
		onBlur,
		onChange,
		onInvalid,
		onSubmit,
		/**
		 * @type {''|null}
		 */
		pristine,
		/**
		 * @type {''|null}
		 */
		touched,
	};
}
