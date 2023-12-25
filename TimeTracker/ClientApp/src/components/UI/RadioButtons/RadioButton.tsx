import { User } from "@redux/intrerfaces";
import "./radiobuttons.css"
import { useState } from 'react';

interface RadioButtonProps {
    options: User[],
    selectedOption: number,
    setSelectedOption: React.Dispatch<React.SetStateAction<number>>
}

export const RadioButton = ({ options, selectedOption, setSelectedOption }: RadioButtonProps) => {

    return (
        <div className="radio-button__wrapper">
            <div className="radio-button__options-wrapper">
                {options.map((user) => (
                    <label key={user.id} className="radio-container">
                        <input
                            value={user.id}
                            type="radio"
                            checked={user.id === selectedOption}
                            onChange={() => { setSelectedOption(user.id) }}
                        />
                        <span className="checkmark"></span>
                        <span>{user.firstName} {user.lastName}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
