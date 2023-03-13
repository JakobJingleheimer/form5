import classnames from 'classnames';
import _map from 'lodash-es/map.js';
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

	handleChange = (e, cb) => {
		const { files } = e.target;

		if (!files?.length) return console.error('[File Preview] Files is empty');

		this.setState({
			previews: _map(files, this.handlePreviews),
		});

		cb(e, files);
	};

	handlePreviews(file) {
		const output = { __proto__: null };
		output.file = file;

		if (file.type.match('image.*')) {
			output.preview = URL.createObjectURL(file);
		}

		return output;
	};

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
			},
			state: {
				previews,
			},
		} = this;

		return (<>
			{!!previews.length && (
				<div className={styles.FileInputPreviews}>
					{_map(previews, ({
						file: { name },
						preview
					}) => {
						if (preview) return (
							<img
								className={styles.FileInputPreview}
								key={name}
								src={preview}
							/>
						);

						return (<p key={name}>{name}</p>);
					})}
				</div>
			)}

			<label
				className={classnames(styles.FileInput, className)}
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
		</>);
	}
}

FileInput.displayName = 'Form5FileInput';
