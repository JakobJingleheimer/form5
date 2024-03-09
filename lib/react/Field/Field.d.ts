declare function Field({ appearance, arrangement, as: Tag, className, fluid, id, label, name, onBlur, onChange, options, readOnly, required, type, variant, ...others }: FieldProps & Omit<React.InputHTMLAttributes<FieldElement>, 'onChange'>): JSX.Element;
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
export type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type As = 'input' | 'select' | 'textarea';
export type OnChange<Value> = (change: {
    id: string;
    name: string;
    value: Value;
}, event: React.ChangeEvent<FieldElement>) => void;
export type BaseFieldProps<Value> = {
    appearance?: import("../Button/Button.jsx").Appearance | undefined;
    arrangement?: Arrangement | undefined;
    as?: As | undefined;
    fluid?: boolean | undefined;
    label: React.ReactNode;
    name: HTMLInputElement['name'];
    onBlur?: ((event: React.FocusEvent<FieldElement>) => void) | undefined;
    onChange?: OnChange<Value> | undefined;
};
export type NumberFieldProps<Value = number> = BaseFieldProps<Value>;
export type TextFieldProps<Value = string> = BaseFieldProps<Value>;
export type EnumerableFieldProps = TextFieldProps;
export type ToggleFieldProps<Value = boolean> = BaseFieldProps<Value>;
export type FieldProps = EnumerableFieldProps | NumberFieldProps | TextFieldProps | ToggleFieldProps;
export type Arrangement = (typeof Field.ARRANGEMENTS)[keyof typeof Field.ARRANGEMENTS];
export type Variant = (typeof Field.VARIANTS)[keyof typeof Field.VARIANTS];
//# sourceMappingURL=Field.d.ts.map