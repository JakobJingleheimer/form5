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
export type OnChange<V extends Value> = (change: {
    id: string;
    name: string;
    value: V;
}, event: React.ChangeEvent<FieldElement>) => void;
export type Type = 'checkbox' | 'color' | 'date' | 'date-time-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';
export type Value = boolean | number | string;
export type FieldProps<V extends Value = string> = {
    appearance?: import("../Button/Button.jsx").Appearance | undefined;
    arrangement?: Arrangement | undefined;
    as?: As | undefined;
    fluid?: boolean | undefined;
    label: React.ReactNode;
    name: HTMLInputElement['name'];
    onBlur?: ((event: React.FocusEvent<FieldElement>) => void) | undefined;
    onChange?: OnChange<V> | undefined;
    options?: Record<string, import("react").ReactNode> | undefined;
    type?: Type | undefined;
    variant?: Variant | undefined;
};
export type Arrangement = (typeof Field.ARRANGEMENTS)[keyof typeof Field.ARRANGEMENTS];
export type Variant = (typeof Field.VARIANTS)[keyof typeof Field.VARIANTS];
//# sourceMappingURL=Field.d.ts.map