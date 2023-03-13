import { Blob } from 'buffer';

await import('react')
	.then((module) => ({
		PureComponent: class MOCK_PureComponent {
			setState = function MOCK_setState(data) {
				Object.assign(this.state, data)
			};
		},
	}));

import FileInput from './FileInput.jsx';


describe('FileInput', () => {
	let finput;

	function generateChangeEvent(count = 1) {
		const files = Array(count);

		for (let i = 0; i < count; i++) files[i] = {
			name: `image_${i}.jpg`,
			type: 'image/jpeg',
		};

		return {
			target: { files },
		};
	}

	beforeEach(() => {
		finput = new FileInput();
	});

	describe('handleChange()', () => {
		context('when selection', () => {
			it('should trigger generating previews', () => {
				const event = generateChangeEvent();
				const mockPreviews = [
					{ preview: 'blob://image_1.jpg' },
				];
				let setStateCalledWith;

				finput.handlePreviews = function MOCK_handlePreviews() {
					return mockPreviews[0];
				}
				finput.setState = function MOCK_setState(data) {
					setStateCalledWith = data;
				}

				finput.handleChange(event, () => {});

				expect(setStateCalledWith).to.eql({
					previews: mockPreviews,
				});
			});
		});

		context('when NO selection', () => {
			it('should abort', () => {
				const ogConsoleError = console.error;
				let consoleErrorCalledWith

				console.error = function MOCK_consoleError(...args) {
					consoleErrorCalledWith = args;
				}

				const event = generateChangeEvent(0);
				let setStateCalled = false;
				let handlePreviewsCalled = false;
				let cbCalled = false;

				finput.handlePreviews = function MOCK_handlePreviews() {
					handlePreviewsCalled = true;
				}
				finput.setState = function MOCK_setState() {
					setStateCalled = true;
				}

				finput.handleChange(event, () => { cbCalled = true });

				expect(consoleErrorCalledWith[0]).to.include('empty');
				expect(setStateCalled, 'setStateCalled').to.be.false;
				expect(handlePreviewsCalled, 'handlePreviewsCalled').to.be.false;
				expect(cbCalled, 'cbCalled').to.be.false;

				// cleanup
				console.error = ogConsoleError;
			});
		});
	});

	describe('handlePreviews()', () => {
		context('when file is an image', () => {
			it('should attach a blob url to supplied file', () => {
				const ogCreateObjectURL = URL.createObjectURL;
				const file = {
					name: 'image_1.jpg',
					type: 'image/jpeg,'
				};
				const previewUrl = `blob://${file.name}`;

				URL.createObjectURL = function MOCK_createObjectURL(file) {
					return previewUrl;
				}

				const output = finput.handlePreviews(file);

				expect(output).to.eql({
					file,
					preview: previewUrl,
				});

				// cleanup
				URL.createObjectURL = ogCreateObjectURL;
			});
		});

		context('when file is NOT an image', () => {
			it('should attach a blob url to supplied file', () => {
				const file = {
					name: 'image_1.jpg',
					type: 'foo/bar,'
				};

				const output = finput.handlePreviews(file);

				expect(output).to.eql({ file });
			});
		});
	});

	describe('before unmount', () => {
		it('should release preview URL(s)', () => {
			const ogRevokeObjectURL = URL.revokeObjectURL;
			let revokeObjectURLCalledWith;

			URL.revokeObjectURL = function MOCK_revokeObjectURL(id) {
				revokeObjectURLCalledWith = id
			}

			const previewUrl = 'blob://image_1.jpg';

			finput.state.previews = [
				{ preview: previewUrl }
			];

			finput.componentWillUnmount();

			expect(revokeObjectURLCalledWith).to.equal(previewUrl);

			// cleanup
			URL.revokeObjectURL = ogRevokeObjectURL;
		});
	})
});
