import { RangeInputProps } from "./InputProps";
import "./inputs.css";

export const RangeInput = ({ title, minRange, maxRange, step, value, onChange }: RangeInputProps) => {

    const rangeInputValues = [];
    for (let i = minRange; i <= maxRange; i += step) {
        rangeInputValues.push(i);
    }

    const handleRangeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = Number(event.target.value);
        onChange(currentValue);
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const currentValue = Number(event.currentTarget.value);
        onChange(currentValue);
    };

    return (
        <div>
            <div className="checkbox-input__title-wrapper">
                <span>{title}</span>
            </div>
            <div className='range-input__wrapper'>
                <input type="range" min={minRange} max={maxRange} step={step} value={value} onChange={handleRangeInputChange} />
                <div className="range-input__values-wrapper">
                    {rangeInputValues.map((val) => (
                        <div key={val} className={`range-input__values-inner ${val === value ? "chosenValue" : ""}`}>
                            <button
                                type="button"
                                onClick={handleButtonClick}
                                value={val}
                            >
                                {val}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

