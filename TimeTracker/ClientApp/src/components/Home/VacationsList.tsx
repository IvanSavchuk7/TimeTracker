import { Loader } from "@components/UI/Loaders/Loader";
import { useAppDispatch, useTypedSelector } from "@hooks/customHooks.ts";
import { fetchUserVacations } from "@redux/slices";
import { VacationStateEnum, WorkedFetchType } from "@redux/types";
import moment from "moment/moment";
import { useEffect } from 'react';
import { getStringVacationState } from "../../utils/vacationHelper.ts";


interface VacationsListProps {
    userId: number
}
const VacationsList = ({ userId }: VacationsListProps) => {
    const dispatch = useAppDispatch();
    const { loading, vacations } = useTypedSelector(s => s.vacations);
    useEffect(() => {
        dispatch(fetchUserVacations({ userId: userId, take: 4, skip: 0, group: {} } as WorkedFetchType))
    }, []);

    return (
        <div className={"work-plans-wrapper"}>
            <h2>You vacations</h2>
            {loading ? <Loader /> : <div className={"vacations-wrapper"}>
                {vacations.map(v => {
                    return <div key={v.id} className={"vacation-card-item"}>
                        <span>{moment(v.startDate).format("M/D/Y")} -- {moment(v.endDate).format("M/D/Y")}</span>
                        <span className={v.vacationState === VacationStateEnum.Edited ? "pending" : v.vacationState.toLowerCase()}>
                            {v.vacationState === VacationStateEnum.Edited ? "Pending" : getStringVacationState(v.vacationState)}
                        </span>
                    </div>
                })}
            </div>}
        </div>
    );
};

export default VacationsList;
