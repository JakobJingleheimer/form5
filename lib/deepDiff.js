import _keys from 'lodash-es/keys.js';
import _isEmpty from 'lodash-es/isEmpty.js';
import _isObject from 'lodash-es/isObject.js';


export default function deepDiff(oldVals, newVals, delta = Object.create(null)) {
	if (
		!_isObject(newVals)
		|| Array.isArray(newVals)
		|| newVals instanceof FileList
		|| newVals instanceof File
	) { // don't iterate values (just accept new)
		if (newVals !== oldVals) {
			return typeof newVals !== 'undefined'
				? newVals
				: null;
		}
		return;
	}

	const oldKeys = _keys(oldVals).sort();
	const newKeys = _keys(newVals).sort();

	for (let nK = 0, n = newKeys.length; nK < n; nK++) {
		const newKey = newKeys[nK];
		const newVal = newVals[newKey];
		const oK = oldKeys.indexOf(newKey);
		const oldVal = oldVals[newKey];

		if (typeof oldVal === 'undefined') {
			delta[newKey] = newVal;
		} else {
			const val = deepDiff(oldVal, newVal, delta[newKey]);
			if (
				typeof val !== 'undefined'
				&& !_isObject(val) || !_isEmpty(val)
			) delta[newKey] = val;
		}

		oldKeys.splice(oK, 1); // remove from list to know below whether to set empty vals
	}

	// if any old keys are left, set them to empty values
	for (let o = oldKeys.length - 1; o > -1; o--) {
		const oldKey = oldKeys[o];
		const oldVal = oldVals[oldKey];

		delta[oldKey] = deepDiff(oldVal);
	}

	return delta;
}
