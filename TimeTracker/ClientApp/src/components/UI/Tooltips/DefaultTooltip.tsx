import { TooltipProps } from "./TooltipProps";

export const DefaultTooltip = ({ description }: TooltipProps) => {
    return (
        <div className="tooltip-wrapper">
            <p>{description}</p>
        </div>
    );
};