declare function Group({ as: Tag, className, ...others }: GroupProps): JSX.Element;
declare namespace Group {
    let displayname: string;
}
export default Group;
export { styles as grouptClasses };
export type React = typeof import("react");
export type GroupProps = {
    as?: import("react").ElementType<any> | undefined;
    className?: string | undefined;
};
//# sourceMappingURL=Group.d.ts.map