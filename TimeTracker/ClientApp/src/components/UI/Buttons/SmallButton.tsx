import {ButtonProps} from "./ButtonProps";
import './buttons.css';


export const SmallButton = ({type, value,handleClick} : ButtonProps) => {
    return (
        <div className="btn-small__wrapper">
            <button type={type} value={value} className="btn-small" onClick={()=>{
                if(handleClick!==undefined) {
                    handleClick()
                }
            }}>
                {value}
            </button>
        </div>
    );
};