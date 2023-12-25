import { H4 } from "@components/Headings";
import { UsersRadioTable } from "@components/Tables/UsersRadioTable";
import { DashboardTracker } from "@components/Trackers/DashboardTracker";
import { TrackerSetHours } from "@components/Trackers/TrackerSetHours";
import { DateRangePicker, PickerDateRange } from "@components/UI/DateRangePicker/DateRangePicker";
import { Loader } from "@components/UI/Loaders/Loader";
import { CurrentDateElement } from "@components/UI/Misc/CurrentDateElement";
import { DashboardSchedulerModal } from "@components/UI/Modals/DashboardSchedulerModal";
import { useAppDispatch, useTypedSelector } from '@hooks/customHooks';
import { fetchWorkedHours } from "@redux/slices";
import moment from "moment";
import { useEffect, useState } from 'react';
import { generateColors } from "../../utils";
import { GetPickerDateRange } from "../../utils/dateTimeHelpers";
import "./dashboardScheduler.css";

export const DashboardScheduler = () => {
    const dispatch = useAppDispatch()

    const { user } = useTypedSelector(state => state.auth)
    const { workedHours, loading } = useTypedSelector(state => state.workedHours)

    const [dateRange, setDateRange] = useState<PickerDateRange>({
        startDate: moment().subtract(1, 'day'),
        endDate: moment().add(1, 'day')
    })
    const [selectedUser, setSelectedUser] = useState<number>(user!.id)
    const [isFormHidden, setIsFormHidden] = useState<boolean>(false);
    const [isModalHidden, setIsModalHidden] = useState<boolean>(false);
    const [colors, setColors] = useState<string[]>([])

    const defaultRowsCount = 6;

    useEffect(() => {
        setColors(generateColors(workedHours.length))
    }, [workedHours])

    useEffect(() => {
        dispatch(fetchWorkedHours({
            userId: selectedUser,
            dateRange: GetPickerDateRange(dateRange)
        }))
    }, [dateRange])

    return (
        <div className="dashboard-component-wrapper">
            <DashboardSchedulerModal isHidden={isModalHidden} setIsHidden={setIsModalHidden} />

            <div className="worked-hours-wrapper">
                <div className="tracker-wrapper">
                    <div className="tracker-inner">
                        <TrackerSetHours userId={selectedUser} />
                    </div>
                </div>
                <div className="progress-boxes-wrapper">
                    {loading
                        ?
                        <div className="loader-wrapper">
                            <Loader />
                        </div>
                        : workedHours.length ? workedHours.map((wh) => (
                            <div className="day-worked-hours-wrapper" key={wh.date.toDateString()}>
                                <div className="worked-hours-date-wrapper">
                                    <CurrentDateElement date={wh.date} showFullDate={true} />
                                </div>
                                {wh.workedHours.map((item, i) =>
                                    <DashboardTracker workedHour={item} key={item.id} />
                                )}
                            </div>
                        )) :
                            <div className="no-data-wrapper">
                                <H4 value="No activity for selected date(s)!" />
                            </div>
                    }</div>
            </div>
            <div className="right-side-form">
                <div className="date-range__wrapper">
                    <div className="show-datepicker__btn" onClick={() => { setIsFormHidden(!isFormHidden) }} />
                    {dateRange.startDate &&
                        <div className="current-date__wrapper">
                            <span>{dateRange.startDate.format("YYYY-MM-DD")}</span>
                        </div>
                    }
                    {dateRange.endDate && !dateRange.endDate.isSame(dateRange.startDate) &&
                        <>
                            <div className="date-range__separator">
                                <span>-</span>
                            </div>
                            <div className="current-date__wrapper">
                                <span>{dateRange.endDate.format("YYYY-MM-DD")}</span>
                            </div>
                        </>
                    }
                </div>
                {isFormHidden &&
                    <div className="date-range-picker-wrapper">
                        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
                    </div>
                }

                <UsersRadioTable selectedUser={selectedUser} setSelectedUser={setSelectedUser} dateRange={dateRange} />
            </div>
        </div >

    );
};