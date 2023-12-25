import { Loader } from "@components/UI/Loaders/Loader.tsx";
import { useAppDispatch, useTypedSelector } from "@hooks/customHooks.ts";
import {
    deleteByVacationId,
    fetchApproverVacationById,
    updateApproverVacationState, updateVacation,
    updateVacationState
} from "@redux/slices";
import { VacationStateEnum } from "@redux/types";
import moment from "moment";
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import info from '../../assets/images/warning.png';
import {
    getApproverVacationString,
    hasWarning,
    isVacationAnswered,
    vacationNotEqual
} from "../../utils/vacationHelper.ts";
import './VacationDetails.css';

interface VacationDetailsProps {
    vacationId: number,
    isOpen: boolean,
    setIsOpen: (arg: boolean) => void
}

const VacationDetails = ({ vacationId, setIsOpen, isOpen }: VacationDetailsProps) => {

    const dispatch = useAppDispatch();
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [approveId, setApproveId] = useState<number>();
    const userId = useTypedSelector(s => s.auth.user?.id);
    const { updated, deleted, approverVacation: av, loading }
        = useTypedSelector(s => s.approverVacations);
    const backRef = useRef<HTMLDivElement>(null);
    function messageInputHandle(e: ChangeEvent<HTMLTextAreaElement>) {
        setMessage(e.target.value)
    }

    useEffect(() => {

        if (updated) {
            dispatch(updateVacationState(approveId!));
            const vacation = { ...updated };
            if (message !== "") {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                delete vacation.user;
                dispatch(updateVacation({ ...vacation, approverMessage: message }));
                setMessage("");
            }
        }
    }, [updated])

    useEffect(() => {
        dispatch(fetchApproverVacationById(vacationId));
    }, [deleted, vacationId]);

    function approve(id: number, state: boolean) {
        setApproveId(id);
        if (!state && message === "") {
            setError("message field required")
            return;
        }
        dispatch(updateApproverVacationState({
            approverId: userId!, vacationId: av?.vacation.id!,
            isApproved: state!, message: message
        }));
    }

    function archive(vacationId: number) {
        dispatch(deleteByVacationId(vacationId))
    }
    function hideElements(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (backRef.current === e.target) {
            backRef.current.style.display = "none";
            setIsOpen(false);
        }
    }
    return (
        <>
            {<div ref={backRef} onClick={hideElements} className="vacation-card-wrapper black-rga" style={{ display: `${isOpen ? "flex" : "none"}` }}>
                {loading ? <Loader /> : <div className="vacation-card">
                    <div className="user-info">
                        <div className="vacation-days">
                            <span>{av?.vacation?.user.firstName} {av?.vacation?.user.lastName}</span>
                            <span style={{ color: "#006494" }}>({av?.vacation?.user.email})</span>
                        </div>
                        <span style={{ display: "flex", alignItems: "center", gap: "5px" }} className={getApproverVacationString(av?.isApproved!, av?.vacation?.vacationState.toLowerCase()!)}>
                            {getApproverVacationString(av?.isApproved!, av?.vacation?.vacationState.toLowerCase()!)}
                            {(!isVacationAnswered(av?.vacation?.vacationState!)
                                && vacationNotEqual(VacationStateEnum.Pending, av?.vacation?.vacationState!) && av?.isApproved === null) && ' by user'}
                            {av?.isDeleted && <span style={{ color: "#0aa9ff" }}> (archived) </span>}
                            {hasWarning(av?.vacation.user.employmentDate.toString()!) ?
                                <div className={"tooltip-wrapper"}>
                                    <img className="tooltip" src={info} style={{ width: "20px", height: "20px" }} alt="" />
                                    <span style={{ top: "20px" }} className="tooltip-text">6 months have not yet passed since the hiring</span>
                                </div> : ""}
                        </span>


                    </div>
                    <div className="vacation-info">
                        <div className="vacation-days">
                            <span>Vacation for: {moment(moment(av?.vacation?.endDate).diff(av?.vacation?.startDate)).format("D")} days</span>
                            <span style={{ color: "#006494" }}>({moment(av?.vacation?.startDate).format("M/D/Y")} - {moment(av?.vacation?.endDate).format("M/D/Y")})</span>
                        </div>
                        <span>Message: {av?.vacation?.message === '' ? "empty" : av?.vacation?.message}</span>
                        <span>Available vacation days: {av?.vacation?.user.vacationDays}</span>
                    </div>
                    {(av?.isApproved === null && !av.isDeleted && av.vacation.vacationState !== VacationStateEnum.Declined) &&
                        <>
                            <textarea value={message} onChange={messageInputHandle} style={{ height: "150px" }} placeholder="Message"></textarea>
                            <span>{error}</span>
                            <div className="btn-group" style={{ alignSelf: "self-end" }}>
                                {(av?.vacation?.vacationState === VacationStateEnum.Canceled) ?
                                    <button onClick={() => archive(av?.vacation?.id)} className="btn-base bth-archive">
                                        Archive
                                    </button>
                                    : <>
                                        <button onClick={() => approve(av?.vacation?.id!, false)} className="btn-base btn-decline">
                                            Decline
                                        </button>
                                        <button onClick={() => approve(av?.vacation?.id!, true)} className="btn-base btn-confirm">
                                            Approve
                                        </button>
                                    </>}
                            </div>
                        </>
                    }

                </div>}
            </div>}
        </>
    );
};

export default VacationDetails;
