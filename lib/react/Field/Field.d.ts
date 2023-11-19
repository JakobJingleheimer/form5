declare function Field({ appearance, arrangement, as: Tag, className, fluid, id, label, name, onBlur, onChange, options, readOnly, required, type, variant, ...others }: {
    appearance: import('../Button/Button.jsx').Appearance;
    arrangement: Arrangement;
    as: import('react').ElementType;
    className: HTMLElement['className'];
    fluid: boolean;
    id: HTMLElement['id'];
    label: HTMLLabelElement['textContent'];
    name: HTMLInputElement['name'];
    onBlur: (event: import('react').FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onChange: (change: {
        id: string;
        name: string;
        value: boolean | number | string;
    }, event: import('react').ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    options: {
        [key: string]: string | null;
    }[];
    readOnly: HTMLInputElement['readOnly'];
    required: HTMLInputElement['required'];
    type: HTMLInputElement['type'];
    variant: Variant;
    others: import('react').HTMLProps<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
}): JSX.Element;
declare namespace Field {
    let displayName: "Form5Field";
    namespace ARRANGEMENTS {
        let COMPACT: "compact";
        let INLINE: "inline";
        let STACKED: "stacked";
        let STAND_ALONE: "stand-alone";
    }
    namespace VARIANTS {
        let CTA: "cta";
        let GLYPH: "glyph";
        let TOGGLE: "toggle";
    }
    namespace propTypes {
        export let arrangement: PropTypes.Requireable<"inline" | "compact" | "stacked" | "stand-alone">;
        export let as: PropTypes.Requireable<PropTypes.ReactComponentLike>;
        export let fluid: PropTypes.Requireable<boolean>;
        export let label: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        let name_1: PropTypes.Validator<string>;
        export { name_1 as name };
        export let onBlur: PropTypes.Requireable<(...args: any[]) => any>;
        export let onChange: PropTypes.Requireable<(...args: any[]) => any>;
        export let options: PropTypes.Requireable<object>;
        export let variant: PropTypes.Requireable<"toggle" | "cta" | "glyph">;
    }
}
export default Field;
export { styles as inputClasses };
export type Arrangement = (typeof Field.ARRANGEMENTS)[keyof typeof Field.ARRANGEMENTS];
export type Variant = (typeof Field.VARIANTS)[keyof typeof Field.VARIANTS];
import PropTypes from 'prop-types';
//# sourceMappingURL=Field.d.ts.map