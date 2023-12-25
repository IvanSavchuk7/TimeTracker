import { SideContentInner } from "./SideContentInner";

export const LoginSideContent = () => {
    return (
        <div className="side-content__wrapper">
            <div className="side-content__vector"></div>
            <SideContentInner />
            <div className="side-content__vector"></div>
        </div>
    );
};