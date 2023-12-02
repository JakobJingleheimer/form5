declare function Button({ appearance, children: label, className, fluid, icon: Icon, type, variant, ...others }: {
    appearance?: Appearance | undefined;
    children: import('react').ReactNode;
    className: HTMLElement['className'];
    fluid?: boolean | undefined;
    icon: import('react').ReactNode;
    type?: "button" | "reset" | "submit" | undefined;
    variant?: Variant | undefined;
    others: import('react').HTMLProps<HTMLButtonElement>;
}): JSX.Element;
declare namespace Button {
    let displayName: "Form5Button";
    namespace APPEARANCES {
        let AFFIRMING: "affirming";
        let BASIC: "basic";
        let DANGER: "danger";
        let PRIMARY: "primary";
        let WARNING: "warning";
    }
    namespace TYPES {
        let BUTTON: "button";
        let RESET: "reset";
        let SUBMIT: "submit";
    }
    namespace VARIANTS {
        let CTA: "cta";
        let GLYPH: "glyph";
    }
    function Group({ className, ...props }: {
        [x: string]: any;
        className: any;
    }): JSX.Element;
}
export default Button;
export { styles as buttonClasses };
export type Appearance = (typeof Button.APPEARANCES)[keyof typeof Button.APPEARANCES];
export type Type = (typeof Button.TYPES)[keyof typeof Button.TYPES];
export type Variant = (typeof Button.VARIANTS)[keyof typeof Button.VARIANTS];
//# sourceMappingURL=Button.d.ts.map