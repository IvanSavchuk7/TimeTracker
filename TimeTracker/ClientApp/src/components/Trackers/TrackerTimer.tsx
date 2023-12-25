import { SmallButton } from "@components/UI/Buttons/SmallButton";
import { CurrentDateElement } from "@components/UI/Misc/CurrentDateElement";
import { Timer } from "@components/UI/Misc/Timer";
import { WorkedHours } from "@components/UI/Misc/WorkedHours";
import { useTypedSelector } from "@hooks/customHooks";
import { WorkedHour } from '@redux/types';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetTimer, startTimer, tick } from '../../redux';
import { GetTimeFromString } from "../../utils/dateTimeHelpers";
import "./trackers.css";

export const TrackerTimer = ({ workedHour }: { workedHour?: WorkedHour }) => {

    if (workedHour) {
        const time = GetTimeFromString(workedHour.totalTime);

        return (
            <>
                <CurrentDateElement date={workedHour.startDate.toDate()} showFullDate={true} />
                <div className="tracker-content__wrapper">
                    <div className="tracker-content__inner">
                        <div className="timer-tracker">
                            <div className="timer-tracker__wrapper worked-hours__timer">
                                <Timer hours={time.hours} minutes={time.minutes} seconds={time.seconds} />
                            </div>
                            <WorkedHours workedHour={workedHour} />
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const dispatch = useDispatch();

    const { hours, minutes, seconds, isRunning, startedAt } = useTypedSelector((state) => state.timer);
    const { user } = useTypedSelector(state => state.auth)

    useEffect(() => {
        if (isRunning) {
            const intervalId = setInterval(() => {
                dispatch(tick());
            }, 1000);

            return () => {
                clearInterval(intervalId);
            }
        }
    }, [dispatch, isRunning]);

    const handleStartButton = () => {
        if (!isRunning) {
            dispatch(startTimer(startedAt));
        }
    };

    const handleStopButton = () => {
        const startDate = new Date(startedAt!);
        const stopDate = new Date();

        dispatch(resetTimer({
            userId: user!.id,
            startDate: moment(startDate).utc().format("YYYY-MM-DDTHH:mm:ss"),
            endDate: moment(stopDate).utc().format("YYYY-MM-DDTHH:mm:ss")
        }));

    }

    return (
        <>
            <CurrentDateElement date={new Date()} showFullDate={true} />
            <div className="tracker-content__wrapper">
                <div className="tracker-content__inner">
                    <div className="timer-tracker">
                        <div className="timer-tracker__wrapper">
                            <Timer
                                hours={hours}
                                minutes={minutes}
                                seconds={seconds}
                            />
                        </div>
                        <div className="tracker-btn__wrapper">
                            {isRunning
                                ? <SmallButton type="button" value="Stop" handleClick={handleStopButton} />
                                : <SmallButton type="button" value="Run" handleClick={handleStartButton} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};