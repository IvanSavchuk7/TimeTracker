import "./headings.css"

export const H1 = ({ value }: { value: string }) => {
    return (
        <div>
            <h1 className="heading-text__h1">{value}</h1>
        </div>
    );
};