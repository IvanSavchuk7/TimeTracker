import ProgressCircle from "@components/Graphics/ProgressCircle.tsx";
import { Loader } from "@components/UI/Loaders/Loader";
import { useAppDispatch, useTypedSelector } from "@hooks/customHooks.ts";
import { fetchWorkedHoursStatistic } from "@redux/slices";
import React, { useEffect, useState } from 'react';
interface HoursStatistic {
    need: number,
    actuallyWorked: number
}
const stats: HoursStatistic = {
    need: 0,
    actuallyWorked: 0
}
interface ProgressProps {
    userId: number
}
const Progress = ({ userId }: ProgressProps) => {
    const dispatch = useAppDispatch();
    const { hoursToWork, loading } = useTypedSelector(s => s.workedHours);
    const [hoursFor, setHoursFor] = useState<HoursStatistic>(stats);
    const [selectValue, setSelectValue] = useState<string>("today");

    useEffect(() => {
        dispatch(fetchWorkedHoursStatistic({ userId: userId, date: new Date() }));
    }, []);

    useEffect(() => {
        if (hoursToWork) {
            setHoursFor({
                need: Number(hoursToWork?.needToWorkToday!),
                actuallyWorked: Number(hoursToWork?.actuallyWorkedToday!)
            })
        }
    }, [hoursToWork]);
    function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        if (e.currentTarget.value === "today") {
            setHoursFor({
                need: Number(hoursToWork?.needToWorkToday!),
                actuallyWorked: Number(hoursToWork?.actuallyWorkedToday!)
            });
            setSelectValue("today");
        } else {
            setHoursFor({
                need: Number(hoursToWork?.needToWork!),
                actuallyWorked: Number(hoursToWork?.actuallyWorked!)
            });
            setSelectValue("month");
        }
    }
    return (
        <div className={"progress-wrapper"} style={{ justifyContent: `${loading ? "center" : ""}` }}>
            {loading ? <Loader /> :
                <>
                    <div className={"worked-hours-options"}>
                        <h2>Hours worked for</h2>
                        <select onChange={(e) => handleSelectChange(e)}
                            value={selectValue}>
                            <option value="today">today</option>
                            <option value="month">month</option>
                        </select>
                    </div>
                    <ProgressCircle
                        percents={hoursFor.actuallyWorked * 100 / hoursFor.need} dependency={selectValue} />
                </>
            }
        </div>
    );
};

export default Progress;
