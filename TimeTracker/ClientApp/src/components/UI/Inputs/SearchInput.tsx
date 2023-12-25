import { useState } from 'react';
import searchInput from "../../../assets/images/search_input_icon.png";
import { SearchInputProps } from "./InputProps";
import './inputs.css';
export const SearchInput = ({ name, placeholder, register, onSearch, onChangeAdditional }: SearchInputProps) => {

    const [search, setSearch] = useState<string>("");
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };


    return (
        <div className="input-wrapper">
            <div className="input-wrapper__inner">
                <input
                    type="search"
                    name={name}
                    placeholder={placeholder}
                    {...register}
                    onChange={(e) => {
                        handleInputChange(e);
                        if (onChangeAdditional) {
                            onChangeAdditional(e);
                        }
                    }}
                    className="search-input"
                    autoComplete='off'
                />
                <button onClick={() => onSearch(search)} className="search-input__toggle-btn">
                    <img src={searchInput} alt="search" />
                </button>
            </div>
        </div >
    );
};