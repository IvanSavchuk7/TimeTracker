import { DashboardSchedulerModalProps } from "./props";


export const DashboardSchedulerModal = ({ isHidden, setIsHidden }: DashboardSchedulerModalProps) => {
    return (
        <>
            {isHidden && <div className="event-form__wrapper" style={{ display: `${!isHidden ? "none" : ''}` }}>
                <button className="event-form__close-btn" onClick={() => setIsHidden(false)}></button>

            </div>}
        </>
    )
}