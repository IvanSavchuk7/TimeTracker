import "./misc.css";

interface TimerProps {
    hours: number,
    minutes: number,
    seconds: number,
}

const padZero = (num: number) => (num < 10 ? `0${num}` : num);

export const Timer = ({ hours, minutes, seconds }: TimerProps) => {
    return (
        <div className="timer-wrapper">
            <span>{padZero(hours)}</span>
            <span>{padZero(minutes)}</span>
            <span>{padZero(seconds)}</span>
        </div>
    );
};