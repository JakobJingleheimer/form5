import _keys from 'lodash-es/keys.js';
import _isArray from 'lodash-es/isArray.js';
import _isEmpty from 'lodash-es/isEmpty.js';
import _isObject from 'lodash-es/isObject.js';


export default function deepDiff(oldVals, newVals, delta = { __proto__: null }) {
	if (
		!_isObject(newVals)
		|| _isArray(newVals)
		|| newVals instanceof FileList
		|| newVals instanceof File
	) { // don't iterate values (just accept new)
		if (newVals === oldVals) return;
		if (typeof newVals !== 'undefined') return newVals;
		return null;
	}

	const oldKeys = _keys(oldVals).sort();
	const newKeys = _keys(newVals).sort();

	for (const newKey of newKeys) {
		const newVal = newVals[newKey];
		const oK = oldKeys.indexOf(newKey);
		const oldVal = oldVals[newKey];

		if (typeof oldVal === 'undefined') {
			delta[newKey] = newVal;
		} else {
			const val = deepDiff(oldVal, newVal, delta[newKey]);

			if (
				typeof val !== 'undefined'
				&& !_isObject(val)
				|| _isArray(val)
				|| !_isEmpty(val)
			) {
				delta[newKey] = val;
			}
		}

		oldKeys.splice(oK, 1); // remove from list to know below whether to set empty vals
	}

	// if any old keys are left, set them to empty values
	for (const oldKey of oldKeys) {
		const oldVal = oldVals[oldKey];

		delta[oldKey] = deepDiff(oldVal);
	}

	return delta;
}
