import PlanList, { PlansListProps } from "@components/Home/PlanList.tsx";
import { useAppDispatch, useTypedSelector } from "@hooks/customHooks.ts";
import { setWorkPlan } from "@redux/slices";
import { SetWorkPlanType } from "@redux/types";
import moment from "moment";
import { ChangeEvent, useState } from "react";

interface PlansProps extends PlansListProps {
    title: string,
    addPlans?: boolean,
    emptyMessage: string
}
const Plans = ({ plans, title, loading, emptyMessage, addPlans = false }: PlansProps) => {
    const dispatch = useAppDispatch();
    const { user } = useTypedSelector(s => s.auth);
    const [startTime, setStartTime] = useState(moment().format("HH:mm"));
    const [endTime, setEndTime] = useState(moment().add(1, 'hour').format("HH:mm"));


    function handlePushPlan() {
        const startTimeMoment = moment(startTime, "HH:mm:ss");
        const endTimeMoment = moment(endTime, "HH:mm:ss");
        

        dispatch(setWorkPlan({
            userId: user?.id!,
            startTime:startTimeMoment.utc().format("HH:mm:ss"),
            endTime: endTimeMoment.utc().format("HH:mm:ss"),
            date: moment().format("YYYY-MM-DD")
        } as SetWorkPlanType))
    }
    function onStartTimeInput(e: ChangeEvent<HTMLInputElement>) {
        setStartTime(e.target.value);
    }
    function onEndTimeInput(e: ChangeEvent<HTMLInputElement>) {
        setEndTime(e.target.value);
    }
    return (
        <div className={"work-plans-wrapper"}>
            <h2>{title}</h2>


            <PlanList emptyMessage={emptyMessage} plans={plans} loading={loading} />
            {addPlans && <div className={"push-plan"}>
                <form>
                    <input onChange={(e) => onStartTimeInput(e)} value={startTime} style={{ padding: "5px" }} className={"time-input"} type="time" />
                    <span>-</span>
                    <input onChange={e => onEndTimeInput(e)} value={endTime} style={{ padding: "5px" }} className={"time-input"} type="time" />
                    <input style={{
                        border: "none",
                        borderRadius: "15px",
                        padding: "5px 10px",
                        color: 'white',
                        cursor: "pointer"
                    }}
                        onClick={handlePushPlan} className={"btn-confirm"} type="button" value="push plan" />
                </form>
            </div>}
        </div>
    );
};

export default Plans;
