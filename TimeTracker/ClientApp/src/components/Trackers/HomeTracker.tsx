import { Timer } from "@components/UI/Misc/Timer";
import { useTypedSelector } from "@hooks/customHooks.ts";
import { resetTimer, startTimer, tick } from "@redux/slices";
import moment from "moment";
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import playImg from "../../assets/images/play.png";
import stopImg from "../../assets/images/stop-button.png";
import "./trackers.css";

const HomeTracker = () => {

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
        <div className={"vacation-wrapper tracker"}>
            <Timer
                hours={hours}
                minutes={minutes}
                seconds={seconds}
            />
            <div className={"play-img-wrapper"} onClick={isRunning ? handleStopButton : handleStartButton}>
                {isRunning ? <img src={stopImg} alt="play" /> : <img style={{ left: "2px" }} src={playImg} alt="play" />}
            </div>
        </div>
    );
};

export default HomeTracker;
