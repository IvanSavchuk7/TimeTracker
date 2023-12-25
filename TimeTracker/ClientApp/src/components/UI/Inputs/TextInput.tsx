import { ErrorTooltip } from "../Tooltips/ErrorTooltip";
import { TextInputProps } from "./InputProps";
import './inputs.css';

export const TextInput = ({ name, placeholder, register, errors, isDisabled }: TextInputProps) => {

    return (
        <div>
            <input type="text"
                name={name}
                placeholder={placeholder}
                className="text-input"
                autoComplete='off'
                disabled={isDisabled}
                {...register} />

            <ErrorTooltip errors={errors} />
        </div>
    );
};