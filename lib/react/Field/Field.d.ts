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
    type: 'checkbox' | 'color' | 'date' | 'date-time-local' | 'email' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';
    value: Value;
};
export type NumberFieldOwnProps = {
    type: 'number';
};
export type NumberFieldProps = BaseFieldProps<number> & NumberFieldOwnProps;
export type TextFieldOwnProps = {
    type: 'color' | 'date' | 'date-time-local' | 'email' | 'image' | 'month' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';
};
export type TextFieldProps = BaseFieldProps<string>;
export type EnumerableFieldOwnProps = {
    type: 'color' | 'date' | 'date-time-local' | 'email' | 'file' | 'image' | 'month' | 'number' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';
    options?: Record<string, import("react").ReactNode> | undefined;
};
export type EnumerableFieldProps = TextFieldProps & EnumerableFieldOwnProps;
export type ToggleFieldOwnProps = {
    type: 'checkbox' | 'radio';
    variant?: Variant | undefined;
};
export type ToggleFieldProps = BaseFieldProps<boolean> & ToggleFieldOwnProps;
export type FieldProps = EnumerableFieldProps | NumberFieldProps | TextFieldProps | ToggleFieldProps;
export type Arrangement = (typeof Field.ARRANGEMENTS)[keyof typeof Field.ARRANGEMENTS];
export type Variant = (typeof Field.VARIANTS)[keyof typeof Field.VARIANTS];
//# sourceMappingURL=Field.d.ts.map