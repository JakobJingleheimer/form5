import { useState } from 'react';


/**
 *
 * @returns A collection of event handlers and states (whose values are either an empty string when
 * true, or `null` when false—because React).
 */
export function useInteractiveStates({
	onDirty = () => {},
	onPristine = () => {},
} = {}) {
	const [pristine, setPristine] = useState('');
	const [touched, setTouched] = useState(null);

	const onBlur = (e) => {
		if (touched !== '') { setTouched('') }
	};
	const onChange = (e) => {
		if (touched !== '') { setTouched('') }
		if (pristine !== null) {
			setPristine(null);
			onDirty(e);
		}
	};
	const onInvalid = (e) => {
		if (touched !== '') { setTouched('') }
	};
	const onSubmit = (e) => {
		if (touched !== null) { setTouched(null) }
		if (pristine !== '') {
			setPristine('');
			onPristine(e);
		}
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
