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
	collection,
) {
	const tag = FIELD_TAGS[element.tagName];

	if (!tag) return values; // Ignore buttons etc & redundant fields

	let {
		checked,
		dataTransfer,
		disabled,
		files,
		id,
		multiple,
		name,
		selectedOptions,
		type,
		value,
	} = element;

	const readOnly = element.hasAttribute('readonly');
	const { __exclude } = values;
	delete values.__exclude;

	if (tag === 'fieldset') return handleFieldset(
		{ ...values, ...(__exclude && { __exclude }) },
		{ // SyntheticEvent properties must be passed as values (React aggressively destroys references)
			disabled,
			elements: element.elements,
			name,
			readOnly,
		},
		i,
		collection,
	);

	name ||= id;

	// Ignore anon content fields. Anon fieldsets are allowed (they have other uses, like disabling
	// child fields).
	if (!name) return values;

	if (__exclude && readOnly) return values;

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

	if (_isArray(values[strippedName])) {
		if (val != null) values[strippedName].push(val); // Avoid holes in array
	}
	else if (isListName(name)) {
		values[strippedName] = [];
		if (val != null) values[strippedName][0] = val; // Avoid holes in array
	}
	else values[name] ??= val;

	return values;
};

/**
 *
 * @param {ComposedData} values The accumulator (values output).
 * @param {HTMLFieldSetElement} fieldset The fieldset.
 * @param {number} i The index of the fieldset in the master list of fields.
 * @returns
 * @param {HTMLFormControlsCollection} collection The HTMLCollection converted to an array.
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
	collection,
) {
	const { __exclude } = values;

	if ((disabled && readOnly && __exclude) || name) {
		const nestedFieldCount = elements.length;
		// Overwrite (break refs) nested fields in master list to avoid double-counting.
		// Nested fields are listed sequentially after the fieldset within the master list.
		collection.splice(
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
		if (!readOnly || (readOnly && !__exclude)) values[name] = _reduce(
			Array.from(elements),
			composeData,
			values[name] ?? { __proto__: null, ...(__exclude && { __exclude }) },
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
		case 'checkbox':
			if (value && value !== 'on') return checked ? value : undefined;
			return checked;
		case 'file': return files || dataTransfer;
		case 'number': return value.length ? +value : undefined;
		case 'radio': return checked ? value : undefined;
		default: return value || undefined;
	}
}
