import { ButtonProps } from "./ButtonProps";

import './buttons.css';

export const LargeButton = ({ type, value, handleClick }: ButtonProps) => {
    return (
        <div className="btn-large__wrapper">
            <button type={type} value={value} className="btn-large" onClick={() => {
                if (handleClick !== undefined) {
                    handleClick()
                }
            }}>
                {value}
            </button>
        </div>
    );
};