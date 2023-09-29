import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import Button from 'form5/react/Button';
import FileInput from 'form5/react/FileInput';
import Field from 'form5/react/Field';
import Form from 'form5/react/Form';

import '../node_modules/reset.css/reset.css';
import styles from './Demo.module.css';


Object.defineProperty(File.prototype, "toJSON", {
	value(...args) {
		return `File { name: '${this.name}', size: ${this.size} bytes }`
	}
});

function TestForm() {
	const [{ delta, values}, setData] = useState({ delta: null, values: null });
	const [{ query }, setSearch] = useState({ query: '' });
	const [isDirty, setDirty] = useState(false);

	return (
		<>
			<section className={styles.Column}>
				<div className={styles.Output}>
					<header className={styles.DataHeading}>Search</header>
					<output className={styles.Data}
					>query: {JSON.stringify(query, null, 2)}</output>
				</div>

				<Form
					name="search"
					role="search"
					onReset={setSearch}
					onSubmit={setSearch}
				>
					<Field name="query" type="search" />
				</Form>
			</section>

			<section className={styles.Column}>
				<div className={styles.Output}>
					<header className={styles.DataHeading}>Delta</header>
					<output className={styles.Data}
					>{JSON.stringify(delta, null, 2)}</output>

					<header className={styles.DataHeading}>Current values</header>
					<output className={styles.Data}
					>{JSON.stringify(values, null, 2)}</output>
				</div>

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

					<Field
						defaultValue="Jacob"
						fluid
						label="Forename"
						name="forename"
						type="text"
					/>
					<Field
						defaultValue="Jingleheimer"
						fluid
						label="Surname"
						name="surname"
						type="text"
					/>

					<Field
						as="textarea"
						fluid
						label="Bio"
						name="bio"
					/>

					<Field
						fluid
						label="Age"
						name="age"
						type="number"
					/>

					<fieldset
						name="contact"
					>
						<Field
							fluid
							label="Email"
							name="email"
							placeholder="john.doe@example.com"
							required
							type="email"
						/>
						<Field
							fluid
							label="Phone"
							name="phoneNumber"
							onKeyPress={({ target }) => { target.value = target.value.replace(/\D/, '') }}
							placeholder="555-5555-555"
							type="tel"
						/>

						<Field
							id="preferEmail"
							label="Prefer email"
							name="preferedContact"
							type="radio"
							value="email"
						/>
						<Field
							id="preferPhone"
							label="Prefer phone"
							name="preferedContact"
							type="radio"
							value="phone"
						/>
					</fieldset>

					<Field
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
					</Field>

					<fieldset>
						<legend className="required">Favourite colour</legend>

						<Button.Group>
							<Field
								id="favouriteBlue"
								label="blue"
								name="favouriteColour"
								required
								type="radio"
								value="blue"
								variant={Field.VARIANTS.CTA}
							/>

							<Field
								id="favouriteGreen"
								label="green"
								name="favouriteColour"
								type="radio"
								value="green"
								variant={Field.VARIANTS.CTA}
							/>

							<Field
								id="favouriteRed"
								label="red"
								name="favouriteColour"
								type="radio"
								value="red"
								variant={Field.VARIANTS.CTA}
							/>
						</Button.Group>
					</fieldset>

					<Field
						label="Favourite date"
						name="favouriteDate"
						type="date"
					/>

					<Field
						label="Togglable"
						name="togglable"
						type="checkbox"
						variant={Field.VARIANTS.TOGGLE}
					/>

					<Field
						checked
						label="Read-only"
						name="readonly"
						readOnly
						type="checkbox"
						variant={Field.VARIANTS.TOGGLE}
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
			</section>
		</>
	);
}

createRoot(document.getElementById('app'))
	.render(<TestForm />);
