export function generatePreview(input: URL['href'] | File): Preview | undefined;
export { styles as fileInputClasses };
declare class FileInput extends PureComponent<FileInputProps, any, any> {
    static defaultProps: {
        icon: string;
        label: string;
        multiple: boolean;
    };
    static getDerivedStateFromProps(props: any, state: any): any;
    constructor(props: FileInputProps | Readonly<FileInputProps>);
    constructor(props: FileInputProps, context: any);
    state: {
        previews: Array<URL['href']>;
    };
    handleChange: (e: any, cb: any) => void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
declare namespace FileInput {
    let displayName: "Form5FileInput";
    namespace propTypes {
        let accept: PropTypes.Requireable<string>;
        let className: PropTypes.Requireable<string>;
        let icon: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        let label: PropTypes.Requireable<string>;
        let multiple: PropTypes.Requireable<boolean>;
        let name: PropTypes.Validator<string>;
        let onChange: PropTypes.Requireable<(...args: any[]) => any>;
    }
}
export default FileInput;
export type Preview = {
    file: File;
    preview?: URL['href'];
};
export type FileInputProps = {
    accept: HTMLInputElement['accept'];
    className: HTMLElement['className'];
    icon: import('react').ReactNode;
    label: HTMLLabelElement['textContent'];
    multiple: HTMLInputElement['multiple'];
    name: HTMLInputElement['name'];
    onChange: (event: import('react').ChangeEvent<HTMLInputElement>, files: FileList) => void;
};
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
//# sourceMappingURL=FileInput.d.ts.map