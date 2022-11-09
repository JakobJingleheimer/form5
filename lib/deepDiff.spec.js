import deepDiff from './deepDiff.js';


describe('deepDiff', () => {
	const avatar = new File([''], 'me.jpg');
	const header1 = new File([''], 'bg1.jpg');
	const header2 = new File([''], 'bg2.jpg');
	const header3 = new File([''], 'bg3.jpg');

	let headers;
	let oldVals;

	beforeEach(() => {
		headers = new FileList(header1, header2);

		oldVals = {
			avatar,
			contactDetails: {
				email: 'jj@example.com',
				tels: {
					home: '1111111111',
					mobile: '5555555555',
				},
				preferred: 'email',
			},
			headers,
			name: 'Jakob Jingleheimer',
			togglable: false,
		};
	});

	context('no differences', () => {
		it('should return an empty object when no change', () => {
			const diff = deepDiff(oldVals, oldVals);

			expect(diff).to.eql({});
		});
	});

	context('with differences', () => {
		context('omitted/removed', () => {
			context('non-iterable values', () => {
				it('should return an object with only the empty property(s)', () => {
					const newVals = {
						contactDetails: {
							tels: {
								home: '1111111111',
							},
						},
						headers,
					};

					const diff = deepDiff(oldVals, newVals);

					expect(diff).to.eql({
						avatar: null,
						contactDetails: {
							email: null,
							preferred: null,
							tels: {
								mobile: null,
							},
						},
						name: null,
						togglable: null,
					});
				});
			});

			context('list-like items', () => {
				it('should return an object with the remaining items and empty values for other items', () => {
					headers = new FileList(header1);

					const diff = deepDiff(
						{
							...oldVals,
							allergies: ['nuts', 'shellfish'],
						},
						{
							...oldVals,
							allergies: [],
							headers,
						},
					);

					expect(diff).to.eql({
						allergies: [],
						headers,
					});
				});
			});
		});

		context('added', () => {
			context('non-iterable values', () => {
				it('should include the new value', () => {
					const newVals = {
						...oldVals,
						contactDetails: {
							...oldVals.contactDetails,
							tels: {
								...oldVals.contactDetails.tels,
								home: '2222222222',
							},
						},
						foo: 'bar',
					};

					const diff = deepDiff(oldVals, newVals);

					expect(diff).to.eql({
						contactDetails: {
							tels: {
								home: '2222222222',
							},
						},
						foo: 'bar',
					});
				});
			});

			context('list-like items', () => {
				it('should take the whole list', () => {
					const newVals = {
						allergies: ['nuts', 'shellfish'],
						headers: new FileList(
							header1,
							header2,
							header3,
						),
					};

					const diff = deepDiff({
						...oldVals,
						allergies: [],
					}, {
						...oldVals,
						...newVals,
					});

					expect(diff).to.eql(newVals);
				});
			});
		});

		context('changed', () => {
			context('when only a root-level checkbox value changes', () => {
				it('should contain only that value', () => {
					const newVal = { togglable: true };
					const newVals = { ...oldVals, ...newVal };
					const diff = deepDiff(oldVals, newVals);

					expect(diff).to.eql(newVal);
				});
			});

			context('when only a nested value changes', () => {
				it('should contain only that value', () => {
					const newVal = { contactDetails: { preferred: 'phone' } };
					const newVals = {
						...oldVals,
						contactDetails: {
							...oldVals.contactDetails,
							...newVal.contactDetails,
						},
					};
					const diff = deepDiff(oldVals, newVals);

					expect(diff).to.eql(newVal);
				});
			});
		});
	});
});
