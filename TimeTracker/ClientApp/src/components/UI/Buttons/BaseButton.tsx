
interface BaseButtonProps {
    disabled: boolean,
    btnStyle: string,
    text: string,
    onClick?: ()=>void,
    classes?:string
}

export const BaseButton = ({ disabled, btnStyle, text, onClick,classes}: BaseButtonProps) => {
    return (
        <button  onClick={() => onClick && onClick()} className={`btn-base btn-${btnStyle} ${classes}  ${disabled && 'disabled'}`} disabled={disabled}>
            {text}
        </button>
    );
};