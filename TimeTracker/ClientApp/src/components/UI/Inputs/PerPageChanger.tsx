import React, { useState } from 'react';

import { useAppDispatch } from "@hooks/customHooks.ts";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";



interface PerPageChangerProps {
    count: number,
    setPerPage: ActionCreatorWithPayload<number>,
    perPage: number
}
const PerPageChanger = ({ count, setPerPage, perPage }: PerPageChangerProps) => {
    const [takeValue, setTakeValue] = useState<number>(perPage);
    const dispatch = useAppDispatch();
    function changeTake(e: React.ChangeEvent<HTMLInputElement>) {
        const newValue = parseInt(e.currentTarget.value);
        if (newValue <= count && newValue > 0) {
            dispatch(setPerPage(parseInt(e.currentTarget.value)));
            setTakeValue(parseInt(e.currentTarget.value));
            return;
        }

    }


    return (
        <div className={"input-search"}>
            <span>Show</span>
            <input style={{ background: '#fbfaff' }} onChange={(e) => changeTake(e)} value={takeValue}
                type="number" placeholder="take" className="input-per-page" />
        </div>
    );
};

export default PerPageChanger;
