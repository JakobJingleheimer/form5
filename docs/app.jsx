import classnames from 'classnames';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import Button from 'react-form5/Button';
import FileInput from 'react-form5/FileInput';
import Input from 'react-form5/Input';
import Form from 'react-form5/Form';

import '../node_modules/reset.css/reset.css';
import styles from './Demo.module.css';


Object.defineProperty(File.prototype, "toJSON", {
	value(...args) {
		return `File { name: '${this.name}', size: ${this.size} bytes }`
	}
});

function TestForm() {
	const [{ delta, values}, setData] = useState({ delta: null, values: null});
	const [isDirty, setDirty] = useState(false);

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
				onDirty={() => setDirty(true)}
				onSubmit={(d, v) => setData({ delta: d, values: v })}
			>
				<Button
					disabled={!isDirty}
					title={!isDirty ? 'No changes to submit' : null }
					type="submit"
				>Submit</Button>

				<Input
					defaultValue="Jacob"
					fluid
					label="forename"
					name="forename"
					type="text"
				/>
				<Input
					defaultValue="Jingleheimer"
					fluid
					label="surname"
					name="surname"
					type="text"
				/>
				<Input
					fluid
					label="age"
					name="age"
					type="number"
				/>

				<fieldset
					name="contact"
				>
					<Input
						fluid
						label="email"
						name="email"
						placeholder="john.doe@example.com"
						required
						type="email"
					/>
					<Input
						fluid
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
					label="favourite date"
					name="favouriteDate"
					type="date"
				/>

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

				<Button.Group>
					<Button appearance={Button.APPEARANCES.WARNING}>Group</Button>
					<Button appearance={Button.APPEARANCES.BASIC}>of</Button>
					<Button appearance={Button.APPEARANCES.AFFIRMING}>of</Button>
				</Button.Group>
			</Form>
		</>
	);
}

createRoot(document.getElementById('app'))
	.render(<TestForm />);