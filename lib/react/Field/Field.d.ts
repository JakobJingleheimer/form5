declare function Field({ appearance, arrangement, as: Tag, className, fluid, id, label, name, onBlur, onChange, options, readOnly, required, type, variant, ...others }: FieldProps & React.InputHTMLAttributes<HTMLInputElement>): JSX.Element;
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
}
export default Field;
export { styles as inputClasses };
export type React = typeof import("react");
export type FieldProps = {
    appearance?: import("../Button/Button.jsx").Appearance | undefined;
    arrangement?: Arrangement | undefined;
    as?: import("react").ElementType<any> | undefined;
    className?: string | undefined;
    fluid?: boolean | undefined;
    id?: string | undefined;
    label: HTMLLabelElement['textContent'];
    name: HTMLInputElement['name'];
    onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onChange: (change: {
        id: string;
        name: string;
        value: boolean | number | string;
    }, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    options: {
        [key: string]: string | null;
    }[];
    readOnly?: boolean | undefined;
    required?: boolean | undefined;
    type?: string | undefined;
    variant?: Variant | undefined;
};
export type Arrangement = (typeof Field.ARRANGEMENTS)[keyof typeof Field.ARRANGEMENTS];
export type Variant = (typeof Field.VARIANTS)[keyof typeof Field.VARIANTS];
//# sourceMappingURL=Field.d.ts.map