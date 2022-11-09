import _isArray from 'lodash-es/isArray.js';
import _reduce from 'lodash-es/reduce.js';


export const FIELD_TAGS = {
	FIELDSET: 'fieldset',
	INPUT: 'input',
	SELECT: 'select',
	TEXTAREA: 'textarea',
};

const listNameRgx = /\[\d*\]$/;
const isListName = (name) => listNameRgx.test(name);

export default function composeData(
	values,
	{
		checked,
		dataTransfer,
		elements,
		files,
		name,
		tagName,
		type,
		value,
		...attrs
	},
	i,
	form,
) {
	const tag = FIELD_TAGS[tagName];

	if (tag && name) { // ignore anon fieldset
		if (tag === 'fieldset') {
			const nestedFieldCount = elements.length;
			const nestedFields = form.splice( // move from master list (avoid double-counting)
				i + 1,
				nestedFieldCount,
				...Array(nestedFieldCount).fill({ tagName: 'NESTED_FIELD' })
			);
			values[name] = _reduce(
				nestedFields,
				composeData,
				{ __proto__: null },
			);
		} else if (tag === 'select' && attrs.multiple) {
			values[name] = attrs.selectedOptions.map(({ value }) => value);
		} else {
			const val = getFieldVal({
				checked,
				files,
				dataTransfer,
				type,
				value,
			});
			const strippedName = name.replace(listNameRgx, '')
			if (_isArray(values[strippedName])) values[strippedName].push(val);
			else if (isListName(name)) values[strippedName] = [val];
			else values[name] ??= val;
		}
	}

	return values;
};

function getFieldVal({
	checked,
	files,
	dataTransfer,
	type,
	value,
}) {
	switch(type) {
		case 'checkbox': return checked;
		case 'file': return files || dataTransfer;
		case 'number': return value.length ? +value : null;
		case 'radio': return checked ? value : null;
		default: return value || null;
	}
}
