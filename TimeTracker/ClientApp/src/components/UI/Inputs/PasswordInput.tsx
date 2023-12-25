import { useState } from 'react';
import hidePasswordIcon from "../../../assets/images/hide_password_icon.png";
import showPasswordIcon from "../../../assets/images/show_password_icon.png";
import { ErrorTooltip } from "../Tooltips/ErrorTooltip";
import { TextInputProps } from "./InputProps";
import './inputs.css';

export const PasswordInput = ({ name, placeholder, register, errors }: TextInputProps) => {
    const [showPassword, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!showPassword);
    };

    return (
        <div className="input-wrapper">
            <div className="input-wrapper__inner">
                <input type={showPassword ? 'text' : 'password'} name={name} placeholder={placeholder} {...register} className="text-input" autoComplete='off' />

                <button type="button" className="password-input__toggle-btn" onClick={togglePasswordVisibility}>
                    <img src={showPassword ? hidePasswordIcon : showPasswordIcon} alt="" />
                </button>
            </div>

            <ErrorTooltip errors={errors} />

        </div>
    );
};