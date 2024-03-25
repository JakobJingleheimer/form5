import { Blob } from 'node:buffer';

await import('react')
	.then((module) => ({
		PureComponent: class MOCK_PureComponent {
			setState = function MOCK_setState(data) {
				Object.assign(this.state, data)
			};
		},
	}));

import FileInput, { generatePreview } from './FileInput.jsx';


const previewSrcRegex = /^blob:/;

describe('FileInput', () => {
	let finput;

	function generateChangeEvent(count = 1) {
		const files = Array(count);

		for (let i = 0; i < count; i++) {
			files[i] = Object.assign(new Blob([''], { type: 'image/jpeg' }), {
				name: `image_${i}.jpg`,
			});
		}

		return {
			target: { files },
		};
	}

	beforeEach(() => {
		finput = new FileInput();
	});

	describe('deriving state from props', () => {
		it('should generate a preview when value is set to a file', () => {
			const state = FileInput.getDerivedStateFromProps({
				value: new File(new Array(), 'preview.jpg'),
			});

			console.log('previews:', state.previews);
			expect(state.previews).to.be.an('Array').and.have.lengthOf(1);
		});

		it('should generate a preview when value is set to a URL', () => {
			const state = FileInput.getDerivedStateFromProps({
				value: 'http://example.com/preview.jpg',
			});

			expect(state.previews).to.be.an('Array').and.have.lengthOf(1);
			expect(state.previews[0]).to.be.ok;
		});

		describe('no initial value', () => {
			it('should use the default state', () => {
				const defaultState = { previews: new Array(0) };
				const state = FileInput.getDerivedStateFromProps({}, defaultState);

				expect(state).to.equal(defaultState);
			});
		});
	});

	describe('handleChange()', () => {
		context('when selection', () => {
			it('should trigger generating previews', () => {
				const event = generateChangeEvent();
				let setStateCalledWith;

				finput.setState = function MOCK_setState(data) {
					setStateCalledWith = data;
				}

				finput.handleChange(event, () => {});

				expect(setStateCalledWith.previews).to.be.an('array').with.lengthOf(1);
				expect(setStateCalledWith.previews[0]).to.have.all.keys(['file', 'preview']);
				expect(setStateCalledWith.previews[0].file).to.eql(event.target.files[0]);
				expect(setStateCalledWith.previews[0].preview).to.match(previewSrcRegex);
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

describe('FileInput → generatePreview()', () => {
	context('when input is a File', () => {
		it('should generate a preview media files', () => {
			[
				'audio/mp3',
				'application/pdf',
				'image/generic',
				'video/mp4',
			].forEach((type) => {
				// Node doesn't support `File`, so fake it with `Blob` (which is the base class of File)
				const file = new Blob([''], { type });
				file.name = 'foo.img';
				const output = generatePreview(file);

				expect(output.file).to.equal(file);
				expect(output.preview).to.match(previewSrcRegex);
			});
		});

		it('should pass along non-media files', () => {
			[
				'application/vnd.oasis.opendocument.text',
				'font/otf',
				'text/plain',
			].forEach((type) => {
				// Node doesn't support `File`, so fake it with `Blob` (which is the base class of File)
				const file = new Blob([''], { type });
				file.name = 'foo.img';
				const output = generatePreview(file);

				expect(output.file).to.equal(file);
				expect(output.preview).to.be.undefined;
			});
		});
	});

	context('when input is a url', () => {
		it('should construct facsimile data', () => {
			const src = 'https://example.com/foo.img';
			const output = generatePreview(src);

			expect(output.file).to.eql({ name: 'foo.img' });
			expect(output.preview).to.equal(src);
		});
	});

	context('when input is invalid', () => {
		it('should return nothing', () => {
			[
				[],
				2,
				Symbol('foo.img'),
				true,
				undefined,
			].forEach((input) => expect(generatePreview(input)).to.be.undefined);
		});
	});
});
