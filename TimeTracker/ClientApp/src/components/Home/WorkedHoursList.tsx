import { FormattedWorkedHours } from "@redux/intrerfaces";
import { workedHours } from "@redux/slices";
import moment from "moment/moment";

interface WorkedHoursListProps {
    workedHours: FormattedWorkedHours[]
}

const WorkedHoursList = ({ workedHours }: WorkedHoursListProps) => {
    return (
        <div className={"work-plans-wrapper"}>
            <h2>Recent activity</h2>
            <div className={'work-plans'}>
                {workedHours.map(w => {
                    return w.workedHours.map(wp => {
                        return <div key={wp.id} className="work-plan green with-date">
                            <span >{wp.startDate.format("HH:mm")} -- {wp.endDate.format("HH:mm")}</span>
                            <span>{moment(w.date).format("DD-MM-YYYY")}</span>
                        </div>
                    })
                })}
            </div>
        </div>
    );
};

export default WorkedHoursList;
