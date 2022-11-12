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
		disabled,
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

	if (!tag) return values; // Ignore buttons etc & redundant fields

	if (tag === 'fieldset') {
		if (disabled) for (const nestedField of elements) nestedField.disabled = disabled;

		if (name) {
			// Overwrite (break refs) nested fields in master list to avoid double-counting.
			// Nested fields are listed sequentially after the fieldset within the master list
			const nestedFieldCount = elements.length;
			form.splice(
				i + 1,
				nestedFieldCount,
				...Array(nestedFieldCount).fill({ tagName: 'NESTED_FIELD' })
			);

			values[name] = _reduce(
				elements,
				composeData,
				{ __proto__: null },
			);
		}

		return values;
	}

	/**
	 * Ignore anon content fields. Anon fieldsets are allowed (they have other uses, like disabling
	 * child fields).
	 */
	if (!name) {
		return values;
	}

	if (disabled) {
		values[name] = null;

		return values;
	}

	if (tag === 'select' && attrs.multiple) {
		values[name] = attrs.selectedOptions.map(({ value }) => value);

		return values;
	}

	const val = getFieldVal({
		checked,
		files,
		dataTransfer,
		type,
		value,
	});
	const strippedName = name.replace(listNameRgx, '');

	if (_isArray(values[strippedName])) values[strippedName].push(val);
	else if (isListName(name)) values[strippedName] = [val];
	else values[name] ??= val;

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
