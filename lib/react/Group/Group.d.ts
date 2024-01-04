declare function Group({ as: Tag, className, ...others }: GroupProps & React.HTMLAttributes<HTMLElement>): JSX.Element;
declare namespace Group {
    let displayName: "Form5Group";
}
export default Group;
export { styles as grouptClasses };
export type React = typeof import("react");
export type GroupProps = {
    as?: import("react").ElementType<any> | undefined;
    children: React.ReactNode;
};
//# sourceMappingURL=Group.d.ts.map