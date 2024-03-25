import { cleanup, fireEvent, render } from '@testing-library/react';

import Group from './Group.jsx';


describe('<Group>', () => {
	it('should have the proper role', () => {
		const group = render(
			<Group />
		)
		.getByRole('group');

		expect(group).to.be.ok;
	});

	it('should respect `as`', () => {
		const group = render(
			<Group as="span" />
		)
		.getByRole('group');

		expect(group.tagName).to.equal('SPAN');
	});

	it('should accept className', () => {
		const group = render(
			<Group as="span" className="foo" />
		)
		.getByRole('group');

		expect(group.className).to.include('Group');
		expect(group.className).to.include('foo');
	});
});
