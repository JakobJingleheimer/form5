declare function Group({ as: Tag, className, ...others }: {
    as: import('react').ElementType;
    className: HTMLElement['className'];
}): JSX.Element;
declare namespace Group {
    let displayname: string;
}
export default Group;
export { styles as grouptClasses };
//# sourceMappingURL=Group.d.ts.map