import { DayPlanForm } from '@components/CalendarForms/DayPlanForm';
import { EventForm } from '@components/CalendarForms/EventForm';
import { useState } from 'react';
import { TabSwitcher } from '../Misc/TabSwitcher';
import { CalendarModalProps } from "./props";


export const CalendarModal = ({ isHidden, setIsHidden, event }: CalendarModalProps) => {
    const [tab, setTab] = useState<boolean>(true)

    return (
        <>
            {isHidden && <div className="event-form__wrapper" style={{ display: `${!isHidden ? "none" : ''}` }}>
                <button className="event-form__close-btn" onClick={() => setIsHidden(null)} />
                <div className="event-form__inner" style={{ display: `${!isHidden ? "none" : ''}` }}>
                    {event ?
                        <>
                            <EventForm setIsOpen={setIsHidden} date={isHidden} event={event} />
                        </> :
                        <>
                            {
                                tab ?
                                    <DayPlanForm setIsOpen={setIsHidden} date={isHidden} /> :
                                    <EventForm setIsOpen={setIsHidden} date={isHidden} event={event} />}
                            <TabSwitcher setter={setTab} tab={tab} />

                        </>
                    }


                </div>
            </div>}
        </>
    )
}