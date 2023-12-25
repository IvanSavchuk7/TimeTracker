import "./misc.css";


interface HrProps {
    isHighlighted?: boolean
}
export const Hr = ({ isHighlighted }: HrProps) => {
    return (
        <div className="separator__wrapper">
            <hr className={`horizontal-line ${isHighlighted ? 'horizontal-line__highlighted' : ''}`} />
        </div>
    );
};