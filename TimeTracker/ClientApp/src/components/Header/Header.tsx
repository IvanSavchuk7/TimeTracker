import { ProfileAvatar } from "@components/UI/Misc/ProfileAvatar";
import { Timer } from "@components/UI/Misc/Timer";
import { resetTimer, startTimer, tick } from "@redux/slices";
import moment from "moment";
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useTypedSelector } from "../../hooks";
import "./Header.css";

export const Header = () => {
    const dispatch = useAppDispatch();
    const { user } = useTypedSelector(state => state.auth);
    const { isRunning, startedAt, hours, minutes, seconds } = useTypedSelector(state => state.timer);
    const isHomePage = (useLocation().pathname === '/');
    const timer = useTypedSelector(state => state.timer)

    useEffect(() => {
        if (!isHomePage && isRunning) {
            const intervalId = setInterval(() => {
                dispatch(tick());
            }, 1000);

            return () => {
                clearInterval(intervalId);
            }
        }
    }, [dispatch, isRunning]);

    const handleStartStopButton = () => {
        if (!isRunning) {
            dispatch(startTimer(startedAt));
        } else {
            const startDate = new Date(startedAt!);
            const stopDate = new Date();

            dispatch(resetTimer({
                userId: user!.id,
                startDate: moment(startDate).utc().format("YYYY-MM-DDTHH:mm:ss"),
                endDate: moment(stopDate).utc().format("YYYY-MM-DDTHH:mm:ss")
            }));
        }
    };

    return (
        <header className="header">
            <div className="header-timer__wrapper">
                {!isHomePage && startedAt && (
                    <div className="header-timer__inner">
                        <div className="header-timer__content" style={!isRunning ? { opacity: '.5' } : {}}>
                            <Timer hours={hours} minutes={minutes} seconds={seconds} />
                        </div>
                        <button className="timer-start-stop__btn" onClick={handleStartStopButton}>
                            <div className={timer.isRunning ? "timer-stop__icon" : "timer-start__icon"}></div>
                        </button>
                    </div>
                )}
            </div>
            <div className="header-profile__wrapper">
                <div className="header-profile__notifications">
                    <div className="header-profile__notifications-inner">
                        <button></button>
                    </div>
                </div>

                <div className="header-profile__name">
                    <span>{`${user?.firstName} ${user?.lastName}`}</span>
                </div>
                <ProfileAvatar initials={`${user?.firstName[0]}${user?.lastName[0]}`} />
            </div>
        </header>

    );
};