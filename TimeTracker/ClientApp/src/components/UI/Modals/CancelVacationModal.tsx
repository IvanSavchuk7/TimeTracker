import { useTypedSelector } from "@hooks/customHooks.ts";
import { Vacation, VacationStateEnum } from "@redux/types";
import moment from "moment";
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './messageModal.css';

interface CancelVacationModalProps {
    isOpen: boolean,
    onSuccess: () => void,
    onEdit: () => void,
    vacation: Vacation,
    setVacation: (vacation: Vacation) => void,
    setIsOpen: (open: boolean) => void,
    clicked: Vacation
}
const CancelVacationModal = ({ isOpen, onSuccess, onEdit, vacation, setVacation, clicked, setIsOpen }: CancelVacationModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const backRef = useRef<HTMLDivElement>(null);
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const { error } = useTypedSelector(s => s.vacations);
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                hideElements();
            }
        }

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [])

    useEffect(() => {
        if (clicked !== undefined) {
            setStartDate(moment(clicked.startDate).format("YYYY-MM-DD"));
            setEndDate(moment(clicked.endDate).format("YYYY-MM-DD"));
        }
    }, [clicked]);

    function hideElements() {
        if (modalRef.current !== null) {
            modalRef.current.style.display = "none";
        }
        if (backRef.current) {
            backRef.current.style.display = "none";
        }
        setIsOpen(false);
    }
    function handleStartDateInput(e: ChangeEvent<HTMLInputElement>) {
        setVacation({ ...vacation, vacationState: VacationStateEnum.Edited, startDate: new Date(e.target.value) })
    }
    function handleEndDateInput(e: ChangeEvent<HTMLInputElement>) {
        setVacation({ ...vacation, vacationState: VacationStateEnum.Edited, endDate: new Date(e.target.value) })
    }

    return (
        <div onClick={hideElements} ref={backRef} className="black-rga" style={{ display: `${isOpen ? 'flex' : 'none'}` }}>
            <div ref={modalRef} onClick={(e) => e.stopPropagation()} style={{ display: `${isOpen ? 'flex' : 'none'}` }} className="cancel-modal">
                <h2 style={{ padding: "10px" }}>Maybe you want edit you vacation days</h2>
                <div className="input-group">
                    <input value={startDate} className="w-90 btn-base" style={{ color: "black" }} onChange={(e) => handleStartDateInput(e)} type="date" />
                    <input value={endDate} className="w-90 btn-base" style={{ color: "black" }} onChange={(e) => handleEndDateInput(e)} type="date" />
                </div>
                <div className="btn-group-left">
                    <button className="btn-base btn-confirm" onClick={onEdit}>Yes,save</button>
                    <button className=" btn-base btn-decline" onClick={onSuccess}>No,cancel it</button>
                </div>
            </div>
        </div>
    );
};

export default CancelVacationModal;
