import { Checkbox } from "../Checkboxes/Checkbox";
import { CheckboxInputProps } from "./InputProps";

export const CheckboxInput = ({ title, options, values, selected, setSelected, isMultipleChoice }: CheckboxInputProps) => {
    const handleCheckboxChange = (value: number, checked: boolean) => {
        const updatedValue = isMultipleChoice ? (checked ? (selected | value) : (selected & ~value)) : (checked ? value : 0);

        setSelected(updatedValue);
    };

    return (
        <div className="checkbox-input__wrapper">
            <div className="checkbox-input__title-wrapper">
                <span>{title}</span>
            </div>
            <div className="checkbox-input__wrapper-inner">
                {options.map((option) => {
                    const isChecked = (selected & option) === option;

                    return (
                        <div className="checkbox-wrapper" key={option.toFixed()}>
                            <Checkbox
                                key={option + 1}
                                value={option}
                                isChecked={isChecked}
                                optionName={values[option]}
                                onChange={handleCheckboxChange}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};