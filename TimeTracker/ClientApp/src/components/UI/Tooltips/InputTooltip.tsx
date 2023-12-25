import { TooltipProps } from "./TooltipProps";
import "./tooltips.css"

export const InputTooltip = ({ description, url, urlTitle }: TooltipProps) => {
    return (
        <div className="tooltip-wrapper">
            <p>{description}</p>
            {url ? <a className="tooltip-link" href={url}>{urlTitle}</a> : null}
        </div>
    );
};