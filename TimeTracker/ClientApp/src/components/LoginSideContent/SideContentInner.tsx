import { DefaultTooltip } from "@components/UI/Tooltips/DefaultTooltip";
import { H2 } from "../Headings";
import "./LoginSideContent.css";
import { SideContentImage } from "./SideContentImage";

export const SideContentInner = () => {
    return (
        <div className="side-content__inner">
            <H2 value="Be effective" />
            <DefaultTooltip description="Optimize your work processes and accomplish more" />
            <SideContentImage />
        </div>
    );
};