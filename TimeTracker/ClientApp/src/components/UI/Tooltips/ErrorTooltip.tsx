import { ErrorTooltipProps } from "./TooltipProps";

export const ErrorTooltip = ({ errors }: ErrorTooltipProps) => {
    return (
        <div className="tooltip__wrapper error-tooltip__wrapper">
            {errors && <div><p className="error-tooltip__text">{errors.message}</p></div>}
        </div>
    );
};