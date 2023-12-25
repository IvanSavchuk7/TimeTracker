import { WorkedHour } from "@redux/types"

export const WorkedHours = ({ workedHour }: { workedHour: WorkedHour }) => {
    return (
        <>
            <div className="worked-time-range__wrapper">
                <div className="time-range__inner">
                    <input
                        type="time"
                        className="time-input"
                        value={workedHour.startDate.format("HH:mm")}
                        disabled={true}
                    />
                </div>
                <div className="time-range__separator">
                    <span>-</span>
                </div>
                <div className="time-range__inner">
                    <input
                        type="time"
                        className="time-input"
                        value={workedHour.endDate.format("HH:mm")}
                        disabled={true}
                    />
                </div>
            </div>
        </>
    )
}