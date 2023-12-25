import React, { ChangeEvent } from 'react';
import "./checkboxes.css"

interface CheckboxProps {
    value: number;
    optionName: string | number | boolean | null;
    selected?: number,
    isChecked: boolean,
    setSelected?: (value: number) => void
    onChange?: (value: number, checked: boolean) => void;
    disabled?:boolean;
}

export const Checkbox = ({value, isChecked = false, optionName, onChange = () => {},disabled}: CheckboxProps) => {
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        onChange(value, checked);
    };

    return (
        <div className="checkbox-wrapper" key={value}>
            <label className="checkbox-inner">
                <input
                    key={value}
                    type="checkbox"
                    value={value}
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    disabled={disabled}
                />
                <div className={`checkbox-checkmark ${disabled&&"checkbox-checkmark-disabled"}`} />
                <span>{optionName}</span>
            </label>
        </div>
    );
};