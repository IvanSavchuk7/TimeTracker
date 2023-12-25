import Plans from "@components/Home/Plans.tsx";
import Progress from "@components/Home/Progress.tsx";
import VacationsList from "@components/Home/VacationsList.tsx";
import WorkedHoursList from "@components/Home/WorkedHoursList.tsx";
import HomeTracker from "@components/Trackers/HomeTracker.tsx";
import { useAppDispatch, useTypedSelector } from "@hooks/customHooks.ts";
import { fetchWorkPlans, fetchWorkedHours } from "@redux/slices";
import moment from "moment";
import { useEffect } from 'react';
import "./HomePage.css";



export const HomeTwo = () => {

    const dispatch = useAppDispatch();
    const { user } = useTypedSelector(s => s.auth);
    const { workedHours } = useTypedSelector(s => s.workedHours);
    const { workPlans, loading: plansLoading } = useTypedSelector(s => s.calendar)


    useEffect(() => {
        dispatch(fetchWorkPlans({
            userIds: [user?.id!],
            dateRange: {
                startDate: moment().format("YYYY-MM-DDT00:00:00"),
                endDate: moment().add(7, "days").format("YYYY-MM-DDT00:00:00"),
            }

        }));

        dispatch(fetchWorkedHours({
            userId: user?.id!, dateRange: {
                startDate: moment().subtract(15, 'days').format("YYYY-MM-DDT00:00:00"),
                endDate: moment().format("YYYY-MM-DDT00:00:00")
            }
        }));

    }, []);


    return (
        <div className="home-wrapper">

            <Progress userId={user?.id!} />

            <Plans emptyMessage={"You have no plans for today"} addPlans={true} loading={plansLoading} plans={workPlans.currentMonth.map(w => {
                const filteredPlans = w.workPlans.filter(wp =>
                    moment(wp.date).isSame(new Date(), 'days')
                );
                return { ...w, workPlans: filteredPlans };
            })} title={"Today plans"} />

            <HomeTracker />



            <Plans emptyMessage={"You have no scheduled plans"} loading={plansLoading} title={"Upcoming schedule"} plans={workPlans.nextMonth} />


            <WorkedHoursList workedHours={workedHours} />

            <VacationsList userId={user?.id!} />
        </div>
    );
};


