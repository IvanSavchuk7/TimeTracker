import { months } from "../../constants";

export const CurrentDateElement = ({ date, showFullDate = false, additional }: { date: Date, showFullDate: boolean, additional?: string }) => {

    const currentDate = showFullDate
        ? `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        : `${months[date.getMonth()]} ${date.getFullYear()}`;

    return (
        <div className="current-date__wrapper">
            <span>{currentDate} {additional ? ` - ${additional}` : ""}</span>
        </div>
    );
};