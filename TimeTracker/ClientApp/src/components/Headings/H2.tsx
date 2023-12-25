import "./headings.css"

export const H2 = ({ value }: { value: string }) => {
    return (
        <div>
            <h2 className="heading-text__h2">{value}</h2>
        </div>
    );
};