import classnames from 'classnames';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import Button from 'form5/react/Button';
import FileInput from 'form5/react/FileInput';
import Input from 'form5/react/Input';
import Form from 'form5/react/Form';

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
					label="Forename"
					name="forename"
					type="text"
				/>
				<Input
					defaultValue="Jingleheimer"
					fluid
					label="Surname"
					name="surname"
					type="text"
				/>

				<Input
					as="textarea"
					fluid
					label="Bio"
					name="bio"
				/>

				<Input
					fluid
					label="Age"
					name="age"
					type="number"
				/>

				<fieldset
					name="contact"
				>
					<Input
						fluid
						label="Email"
						name="email"
						placeholder="john.doe@example.com"
						required
						type="email"
					/>
					<Input
						fluid
						label="Phone"
						name="phoneNumber"
						onKeyPress={({ target }) => { target.value = target.value.replace(/\D/, '') }}
						placeholder="555-5555-555"
						type="tel"
					/>

					<Input
						id="preferEmail"
						label="Prefer email"
						name="preferedContact"
						type="radio"
						value="email"
					/>
					<Input
						id="preferPhone"
						label="Prefer phone"
						name="preferedContact"
						type="radio"
						value="phone"
					/>
				</fieldset>

				<Input
					as="select"
					label="Current continent"
					name="continent"
				>
					<option value="AF">Africa</option>
					<option value="AN">Antarctica</option>
					<option value="AS">Asia</option>
					<option value="EU">Europe</option>
					<option value="NA">North America</option>
					<option value="OC">Oceania</option>
					<option value="SA">South America</option>
				</Input>

				<fieldset>
					<legend className="required">Favourite colour</legend>

					<Button.Group>
						<Input
							id="favouriteBlue"
							label="blue"
							name="favouriteColour"
							required
							type="radio"
							value="blue"
							variant={Input.VARIANTS.CTA}
						/>

						<Input
							id="favouriteGreen"
							label="green"
							name="favouriteColour"
							type="radio"
							value="green"
							variant={Input.VARIANTS.CTA}
						/>

						<Input
							id="favouriteRed"
							label="red"
							name="favouriteColour"
							type="radio"
							value="red"
							variant={Input.VARIANTS.CTA}
						/>
					</Button.Group>
				</fieldset>

				<Input
					label="Favourite date"
					name="favouriteDate"
					type="date"
				/>

				<Input
					label="Togglable"
					name="togglable"
					type="checkbox"
					variant={Input.VARIANTS.TOGGLE}
				/>

				<Input
					checked
					label="Read-only"
					name="readonly"
					readOnly
					type="checkbox"
					variant={Input.VARIANTS.TOGGLE}
				/>

				<FileInput
					icon="📂"
					label="Profile photo"
					name="profilePhoto"
				/>

				<Button.Group>
					<Button appearance={Button.APPEARANCES.WARNING}>Group</Button>
					<Button appearance={Button.APPEARANCES.BASIC}>of</Button>
					<Button appearance={Button.APPEARANCES.AFFIRMING}>Buttons</Button>
				</Button.Group>
			</Form>
		</>
	);
}

createRoot(document.getElementById('app'))
	.render(<TestForm />);
