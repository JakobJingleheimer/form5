import { cleanup, render } from '@testing-library/react';

import Button from './Button.jsx';


describe('<Button>', () => {
	it('should consume children as label', () => {
		const button = render(
			<Button>Hello world</Button>
		)
		.getByText('Hello world');

		expect(button).to.be.ok;
	});

	it('should respect `fluid`', () => {
		const button = render(
			<Button fluid />
		)
		.getByRole('button');

		expect(button.className).to.include('fluid');
	});

	it('should respect `appearance`', () => {
		for (const appearance of Object.values(Button.APPEARANCES)) {
			const button = render(
				<Button appearance={appearance} />
			)
			.getByRole('button');

			expect(button.getAttribute('appearance')).to.equal(appearance);

			cleanup();
		}
	});

	it('should respect `type`', () => {
		for (const type of Object.values(Button.TYPES)) {
			const button = render(
				<Button type={type} />
			)
			.getByRole('button');

			expect(button.getAttribute('type')).to.equal(type);

			cleanup();
		}
	});

	it('should respect `variant`', () => {
		for (const variant of Object.values(Button.VARIANTS)) {
			const button = render(
				<Button variant={variant} />
			)
			.getByRole('button');

			expect(button.getAttribute('variant')).to.equal(variant);

			cleanup();
		}
	});
});

describe('<Button.Group>', () => {
	it('should render an augmented <Group>', () => {
		const group = render(
			<Button.Group />
		)
		.getByRole('group');

		expect(group.className).to.include('ButtonGroup');
	});
});
