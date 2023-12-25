import { DropDownProps } from "./DropDownProps";
import "./dropdowns.css";


export const Dropdown = ({ title, options, onSelectChange, register }: DropDownProps) => {

    return (
        <div className="dropdown-wrapper">
            <div className="dropdown-wrapper__inner">
                <select onChange={onSelectChange} name={title} className="dropdown-body" defaultValue="" >
                    {!register &&
                        <option value="all" key={title} >{title}</option>}
                    {options.map((option) => (
                        <option value={option.value} key={option.name}>{option.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};