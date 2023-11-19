export function Form({ children, className, onDirty, onPristine, ...props }: {
    children: import('react').ReactNode;
    className: string;
    onDirty: (isDirty: true) => void;
    onPristine: (isDirty: false) => void;
    onReset: import('react').DOMAttributes<HTMLFormElement>['onReset'];
    onSubmit: OnSubmit;
}): JSX.Element;
export namespace Form {
    export { FIELD_TAGS };
    export let displayName: "Form5Form";
    export namespace propTypes {
        let onDirty: PropTypes.Requireable<(...args: any[]) => any>;
        let onPristine: PropTypes.Requireable<(...args: any[]) => any>;
        let onSubmit: PropTypes.Validator<(...args: any[]) => any>;
    }
}
export function onSubmit(event: SubmitEvent, initValues: import("react").MutableRefObject<import("../../composeData.js").ComposedData>, cb: OnSubmit): void;
export function setup(formElement: HTMLFormElement, initValues: import("react").MutableRefObject<import("../../composeData.js").ComposedData>): void;
export { styles as formClasses };
declare const _default: import("react").MemoExoticComponent<typeof Form>;
export default _default;
export type ComposedData = import('../../composeData.js').ComposedData;
export type SubmitEvent = import('react').FormEvent<HTMLFormElement>;
export type ResetEvent = import('react').FormEvent<HTMLFormElement>;
export type OnSubmit = (delta: ComposedData, all: ComposedData, SubmitEvent: any) => void;
export type Values = import('react').MutableRefObject<ComposedData>;
import { FIELD_TAGS } from '../../composeData.js';
import PropTypes from 'prop-types';
//# sourceMappingURL=Form.d.ts.map