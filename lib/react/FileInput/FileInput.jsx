import { clsx } from 'clsx';
import _map from 'lodash-es/map.js';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Button from '../Button/Button.jsx';

import styles from './FileInput.module.css';


export { styles as fileInputClasses };

export default class FileInput extends PureComponent {
	static defaultProps = {
		icon: (<span>📂</span>),
		label: 'Select file(s)',
		multiple: false,
		onChange: () => {},
	}

	state = {
		previews: new Array(0),
	};

	static getDerivedStateFromProps(props, state) {
		if (
			props.value
			&& (
				props.value instanceof File
				|| typeof props.value === 'string'
			)
		) {
			return { previews: [generatePreview(props.value)] };
		}

		return state;
	}

	handleChange = (e, cb) => {
		const { files } = e.target;

		if (!files?.length) return console.error('[File Preview] Files is empty');

		this.setState({
			previews: _map(files, generatePreview),
		});

		cb(e, files);
	}

	componentWillUnmount() {
		for (const { preview } of this.state.previews) {
			URL.revokeObjectURL(preview);
		}
	}

	render() {
		const {
			handleChange,
			props: {
				accept,
				className,
				icon,
				label,
				multiple,
				name,
				onChange,
				previewsClassName,
				wrapperClassName,
			},
			state: {
				previews,
			},
		} = this;

		return (
			<div className={clsx(styles.FileInputWrapper, wrapperClassName)}>
				{!!previews.length && (
					<div className={clsx(styles.FileInputPreviews, previewsClassName)}>
						{_map(previews, ({
							file,
							preview,
						}) => {
							if (preview) return (
								<figure className={styles.FileInputPreview} key={file.name}>
									<object data={preview} type={file.type} />
								</figure>
							);

							if (file) return (<p key={file.name}>{file.name}</p>);
						})}
					</div>
				)}

				<label
					className={clsx(styles.FileInput, className)}
					htmlFor={name}
				>
					<Button
						appearance={Button.APPEARANCES.BASIC}
						className={styles.FileInputButton}
						icon={icon}
					>
						{label}
					</Button>

					<input
						accept={accept}
						className={styles.FileInputControl}
						id={name}
						multiple={multiple}
						name={name}
						onChange={(e) => handleChange(e, onChange)}
						type="file"
					/>
				</label>
			</div>
		);
	}
}
FileInput.displayName = 'Form5FileInput';
FileInput.propTypes = {
	accept: PropTypes.string,
	className: PropTypes.string,
	icon: PropTypes.node,
	label: PropTypes.string,
	multiple: PropTypes.bool,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	previewsClassName: PropTypes.string,
	wrapperClassName: PropTypes.string,
};

/**
 * @param {URL['href'] | File} input
 */
export function generatePreview(input) {
	const output = {};
	output.file = input;

	// `File` doesn't exist in node, so its `createObjectURL` expects a `Blob`
	// `File` inherits from `Blob`, so checking for `Blob` also catches `File`
	if (input instanceof Blob) {
		if (input.type.match('^(audio|application|image|video)\/.*')) {
			output.preview = URL.createObjectURL(input);
		}
		return output;
	}

	try { // check if `file` is a URL
		if (
			typeof input !== 'string'
			&& !(
				input.startsWith('http')
				|| input.startsWith('file')
			)
		) throw 'not a URL';
		const name = (new URL(input)).pathname.split('/').pop();

		output.file = { name };
		output.preview = input;

		return output;
	} catch { }
}
