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
	element,
	i,
	form,
) {
	let {
		checked,
		dataTransfer,
		disabled,
		elements,
		files,
		id,
		multiple,
		name,
		selectedOptions,
		tagName,
		type,
		value,
	} = element;
	const tag = FIELD_TAGS[tagName];

	if (!tag) return values; // Ignore buttons etc & redundant fields

	const readOnly = element.hasAttribute('readonly');

	if (tag === 'fieldset') {
		const nestedFieldCount = elements.length;

		// Signal when composeData naturally hits the nested field to skip it.
		// Setting `nestedField.disabled` will mutate the actual element (which it shouldn't).
		if (disabled) {
			if (readOnly) {
				// Overwrite (break refs) nested fields in master list to avoid double-counting.
				// Nested fields are listed sequentially after the fieldset within the master list.
				form.splice(
					i + 1,
					nestedFieldCount,
					...Array(nestedFieldCount).fill({ tagName: 'NESTED_FIELD' }),
				);
			} else {
				const vs = name
					? values[name] ??= { __proto__: null }
					: values;
				for (const nestedField of elements) vs[nestedField.name || nestedField.id] = null;
			}
		}

		if (name) {
			// Overwrite (break refs) nested fields in master list to avoid double-counting.
			// Nested fields are listed sequentially after the fieldset within the master list.
			form.splice(
				i + 1,
				nestedFieldCount,
				...Array(nestedFieldCount).fill({ tagName: 'NESTED_FIELD' }),
			);

			if (!readOnly) values[name] = _reduce(
				Array.from(elements),
				composeData,
				values[name] ?? { __proto__: null },
			);
		}

		return values;
	}

	name ||= id;

	// Ignore anon content fields. Anon fieldsets are allowed (they have other uses, like disabling
	// child fields).
	if (!name) return values;

	// A placeholder is present in `values` is a signal to skip it in output.
	if (values[name] === null) {

		return values;
	}

	if (disabled) {
		values[name] = null;

		return values;
	}

	if (tag === 'select' && multiple) {
		values[name] = selectedOptions.map(({ value }) => value);

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
		case 'number': return value.length ? +value : undefined;
		case 'radio': return checked ? value : undefined;
		default: return value || undefined;
	}
}
