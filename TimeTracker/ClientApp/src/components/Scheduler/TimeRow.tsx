import { useTypedSelector } from "@hooks/customHooks";
import { SchedulerWorkPlan, SchedulerWorkedHour } from "@redux/types";
import { convertTimeToIndex } from "../../utils/dateTimeHelpers";
import { hours } from "../constants";

export const TimeRow = ({ workedHour, color, onClick }: { workedHour: SchedulerWorkedHour, color: string, onClick: React.Dispatch<React.SetStateAction<SchedulerWorkPlan | null>> }) => {
    const { users } = useTypedSelector(state => state.users)
    const { user } = useTypedSelector(state => state.auth)

    const displayUser = workedHour.userId == user!.id ? user : users.find(u => u.id == workedHour.userId)
    const minMinutesWorked = 30;
    const isOnVacation = workedHour.userId == user!.id;


    return (
        <div className="content-row" >
            <div className="user-name__wrapper">
                <div className="user-name__inner">
                    <div className="user-name__circle" style={{ border: `6px solid ${color}` }}></div>
                    <span>{displayUser!.firstName} {displayUser!.lastName}</span>
                </div>
            </div>
            {isOnVacation ? (<div className="time-row__msg-wrapper"><div className="msg-icon__wrapper"><div className="on-vacations__icon-inner"></div></div><span>ON VACATION</span></div>)
                : workedHour.workPlans.map((item, i) =>
                    convertTimeToIndex(item.totalTime) >= minMinutesWorked &&
                    <div key={i}
                        className={workedHour.userId == user!.id
                            ? "working-hours__inner-row clickable"
                            : "working-hours__inner-row"}
                        style={{
                            width: `${(convertTimeToIndex(item.totalTime) / (hours.length * 60)) * 100}%`,
                            background: color,
                            left: `${((convertTimeToIndex(item.startTime) - convertTimeToIndex(hours[0])) / (hours.length * 60)) * 100}%`
                        }}
                        onClick={() => { if (workedHour.userId == user!.id) onClick(item) }}>

                        <div className="time-range__wrapper">
                            <span className="details-span">{item.startTime.slice(0, -3)} - {item.endTime.slice(0, -3)}</span>
                        </div>

                        {
                            workedHour.userId != user!.id &&
                            <div className='user-name__wrapper'>
                                <span className=''>{item.user}</span>
                            </div>
                        }

                    </div>
                )}
        </div>
    )
}