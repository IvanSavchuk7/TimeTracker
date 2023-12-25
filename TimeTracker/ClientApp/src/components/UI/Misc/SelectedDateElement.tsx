import { months } from "../../constants";

export const SelectedDateElement = ({ date }: { date: string }) => {
    const selectedDate = new Date(date);

    return (
        <div className="selected-date__wrapper">
            <span>{`${months[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`}</span>
        </div>
    );
};