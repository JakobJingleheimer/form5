import classnames from 'classnames';
import { render } from 'react-dom';

import Button from '../lib/Button/index.jsx';
import FileInput from '../lib/FileInput/index.jsx';
import Input from '../lib/Input/index.jsx';
import Form from '../lib/Form/index.jsx';

import '../node_modules/reset.css/reset.css';
import styles from './Demo.module.css';

Object.defineProperty(File.prototype, "toJSON", {
	value(...args) {
		return `File { name: '${this.name}', size: ${this.size} bytes }`
	}
});

function TestForm() {
	const [{ delta, values}, setData] = React.useState({ delta: null, values: null});

	return (
		<>
			<section className={classnames(styles.Column, styles.Output)}>
				{delta && (<>
					<header className={styles.DataHeading}>Delta</header>
					<output className={styles.Data}
					>{JSON.stringify(delta, null, 2)}</output>
				</>)}
				{delta && values && (<br />)}
				{values && (<>
					<header className={styles.DataHeading}>Current values</header>
					<output className={styles.Data}
					>{JSON.stringify(values, null, 2)}</output>
				</>)}
			</section>

			<Form
				className={styles.Column}
				name="test"
				onSubmit={(d, v) => setData({ delta: d, values: v })}
			>
				<Button type="submit">Submit</Button>

				<Input
					defaultValue="Jacob"
					label="forename"
					name="forename"
					type="text"
				/>
				<Input
					defaultValue="Jingleheimer"
					label="surname"
					name="surname"
					type="text"
				/>
				<Input
					label="age"
					name="age"
					type="number"
				/>

				<fieldset
					name="contact"
				>
					<Input
						label="email"
						name="email"
						placeholder="john.doe@example.com"
						required
						type="email"
					/>
					<Input
						label="phone"
						name="phoneNumber"
						onKeyPress={({ target }) => { target.value = target.value.replace(/\D/, '') }}
						placeholder="555-5555-555"
						type="tel"
					/>

					<Input
						id="preferEmail"
						label="prefer email"
						name="preferedContact"
						type="radio"
						value="email"
					/>
					<Input
						id="preferPhone"
						label="prefer phone"
						name="preferedContact"
						type="radio"
						value="phone"
					/>
				</fieldset>

				<Input
					label="togglable"
					name="togglable"
					type="checkbox"
					variant={Input.VARIANTS.TOGGLE}
				/>

				<Input
					checked
					label="read-only"
					name="readonly"
					readOnly
					type="checkbox"
					variant={Input.VARIANTS.TOGGLE}
				/>

				<FileInput
					icon="📂"
					label="profile photo"
					name="profilePhoto"
				/>
			</Form>
		</>
	);
}

render(
	<TestForm />,
	document.getElementById('app')
);
