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

	if (tag === 'fieldset') return handleFieldset(
		values,
		{ // SyntheticEvent properties must be passed as values (React aggressively destroys references)
			disabled,
			elements: element.elements,
			name,
			readOnly,
		},
		i,
		form,
	);

	name ||= id;

	// Ignore anon content fields. Anon fieldsets are allowed (they have other uses, like disabling
	// child fields).
	if (!name) return values;

	if (readOnly) return values;

	// This is a nested field that was inside a disabled <fieldset>.
	if (values[name] === null) return values;

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

/**
 *
 * @param {Record<string, any>} values The accumulator (values output).
 * @param {HTMLFieldSetElement} fieldset The fieldset.
 * @param {number} i The index of the fieldset in the master list of fields.
 * @param {HTMLFormControlsCollection} form The HTMLCollection converted to an array.
 * @returns
 */
function handleFieldset(
	values,
	{
		disabled,
		elements,
		name,
		readOnly,
	},
	i,
	form,
) {
	if ((disabled && readOnly) || name) {
		const nestedFieldCount = elements.length;
		// Overwrite (break refs) nested fields in master list to avoid double-counting.
		// Nested fields are listed sequentially after the fieldset within the master list.
		form.splice(
			i + 1,
			nestedFieldCount,
			...Array(nestedFieldCount).fill({ tagName: 'NESTED_FIELD' }),
		);
	}

	// ! Setting `nestedField.disabled` will mutate the actual element (which it shouldn't).
	// Instead, process nested fields here.
	if (disabled && !readOnly) {
		const vs = name
			? values[name] ??= { __proto__: null }
			: values;
		for (const nestedField of elements) vs[nestedField.name || nestedField.id] = null;
	}

	if (name) {
		if (!readOnly) values[name] = _reduce(
			Array.from(elements),
			composeData,
			values[name] ?? { __proto__: null },
		);
	}

	return values;
}

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
