import { Loader } from "@components/UI/Loaders/Loader";
import { SortedCalendarArr } from "@redux/intrerfaces";
import moment from "moment";

export interface PlansListProps {
    plans: SortedCalendarArr[],
    loading: boolean,
    emptyMessage: string
}
const PlanList = ({ plans, loading, emptyMessage }: PlansListProps) => {

    const arr: SortedCalendarArr[] = plans;

    return (
        <>
            {loading ? <Loader /> : <div className="work-plans">
                {arr.map(w => w.workPlans.map(wp => {
                    return <div className="work-plan blue with-date" key={wp.id}>
                        <span>{moment(wp.startTime, 'HH:mm').format("HH:mm")} -- {moment(wp.endTime, 'HH:mm').format("HH:mm")}</span>
                        <span>{moment(wp.date).format("DD-MM-YYYY")}</span>
                    </div>
                }))}

                {arr.length == 0 ?
                    <div className="work-plan" style={{ fontFamily: "sans-serif", fontSize: "18px" }}>
                        {emptyMessage}
                    </div> : ""}
            </div>}
        </>
    );
};

export default PlanList;
