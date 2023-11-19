declare function Group({ as: Tag, className, ...others }: {
    as: import('react').ElementType;
    className: HTMLElement['className'];
}): JSX.Element;
declare namespace Group {
    let displayname: string;
    namespace propTypes {
        let as: PropTypes.Requireable<PropTypes.ReactComponentLike>;
    }
}
export default Group;
export { styles as grouptClasses };
import PropTypes from 'prop-types';
//# sourceMappingURL=Group.d.ts.map