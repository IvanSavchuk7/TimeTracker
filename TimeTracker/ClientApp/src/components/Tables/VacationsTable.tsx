import { H4 } from "@components/Headings";
import Pager from "@components/Paging/Pager.tsx";
import PerPageChanger from "@components/UI/Inputs/PerPageChanger.tsx";
import CancelVacationModal from "@components/UI/Modals/CancelVacationModal.tsx";
import { AddVacationForm } from "@components/VacationForms/AddVacationForm.tsx";
import { Vacation, VacationStateEnum, WorkedFetchType } from "@redux/types";
import moment from "moment/moment";
import React, { ChangeEvent, useEffect, useState } from 'react';
import info from '../../assets/images/info.png';
import { useAppDispatch, useTypedSelector } from "../../hooks";
import {
    addVacationFilter,
    changeVacationState,
    fetchUserVacations,
    setVacationOrder,
    setVacationsPerPage,
    setVacationsSkip,
    setVacationsTake,
    updateToDefault,
    updateVacation,
    vacationFiltersToDefault
} from "../../redux";
import { getStringVacationState } from "../../utils/vacationHelper.ts";
import { Loader } from "../UI/Loaders/Loader.tsx";
import './Table.css';
import './VacationsTable.css';

export const VacationsTable = () => {

    const { error, group, orderBy, take, skip, perPage, extensions, updated, loading, vacations }
        = useTypedSelector(s => s.vacations);


    const dispatch = useAppDispatch();
    const userId = useTypedSelector(u => u.auth.user?.id);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [isAddVacationOpen, setIsAddVacationOpen] = useState<boolean>(false);
    const [clicked, setClicked] = useState<Vacation>();

    const [selected, setSelected] = useState<string>("all")

    const [orderSelected, setOrderSelected] = useState<string>("Pending");

    useEffect(() => {
        dispatch(fetchUserVacations({
            userId: userId!,
            take: take,
            skip: skip,
            group: group,
            orderBy: orderBy
        } as WorkedFetchType))
    }, [group, take, orderBy]);

    useEffect(() => {
        if (updated !== null) {
            dispatch(updateToDefault(clicked?.id!));
        }
    }, [updated]);

    function handleSelect(vacation: Vacation) {
        setClicked(vacation);
        setIsOpen(true);
    }

    function handleCancel() {
        dispatch(changeVacationState({ id: clicked?.id!, state: VacationStateEnum.Canceled }));
        setIsOpen(false);
    }

    function handleVacationEdit() {
        dispatch(updateVacation({ ...clicked!, userId: userId! }));
        setIsOpen(false);
    }

    function handleYearFilter(e: React.ChangeEvent<HTMLSelectElement>) {
        if (e.target.value == "all") {
            dispatch(vacationFiltersToDefault());
            setSelected(e.currentTarget.value);
            return;
        }
        dispatch(addVacationFilter({
            operator: "contains",
            value: e.currentTarget.value,
            property: "StartDate",
            connector: "and"
        }));
        setSelected(e.currentTarget.value);
    }

    function handleVacationCreateClick() {
        setIsAddVacationOpen(true);
    }

    function onOrderChange(e: ChangeEvent<HTMLSelectElement>) {
        setOrderSelected(e.target.value);
        dispatch(setVacationOrder({
            orderBy: {
                property: "VacationState",
                direction: "DESC",
                value: e.target.value
            }
        }));
    }

    return (
        <>
            <CancelVacationModal clicked={clicked!} setIsOpen={setIsOpen} setVacation={setClicked} vacation={clicked!}
                onEdit={handleVacationEdit} onSuccess={handleCancel} isOpen={isOpen} />
            <AddVacationForm setIsOpen={setIsAddVacationOpen} isOpen={isAddVacationOpen} />
            <div className="vacations-content__wrapper">

                <div className="requests-wrapper">
                    <div className="search-bar">
                        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                            <select className="input-search" value={selected} onChange={(e) => handleYearFilter(e)}>
                                <option value="all">all</option>
                                <option value="2020">2020</option>
                                <option value="2021">2021</option>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                            </select>
                            <PerPageChanger setPerPage={setVacationsPerPage} perPage={perPage}
                                count={extensions?.count!} />
                            <div className={"input-search"}>
                                <span style={{ marginRight: "5px" }}>Order by</span>
                                <select value={orderSelected} onChange={e => onOrderChange(e)} style={{ border: "none", background: '#fbfaff' }}>
                                    <option value="4">Pending</option>
                                    <option value="2">Declined</option>
                                    <option value="8">Cancelled</option>
                                    <option value="1">Approved</option>
                                </select>
                            </div>

                        </div>
                        <a className='btn-small' onClick={handleVacationCreateClick}>Create vacation</a>
                    </div>
                </div>
                {vacations.length === 0 && <div className="empty info"><H4 value="You have no active vacations" /></div>}
                {loading ? <Loader /> : vacations.map(v => {
                    return (
                        <div key={v.id} className="vacation-item">
                            <span>{moment(v.startDate).format("M/D/Y")}</span>
                            <span>{moment(v.endDate).format("M/D/Y")}</span>
                            <span style={{ display: "flex", position: "relative", alignItems: 'center', gap: "8px" }}
                                className={`${v.vacationState === VacationStateEnum.Edited ? "pending" : v.vacationState.toLowerCase()}`}>
                                {v.vacationState === VacationStateEnum.Edited ? "Pending" : getStringVacationState(v.vacationState)}
                                {v.approverMessage && <div className={"tooltip-wrapper"}>
                                    <img className="tooltip" style={{ width: "25px", height: "25px" }} src={info}
                                        alt="info" />
                                    <span className="tooltip-text" style={{ right: "-125px" }}>{v.approverMessage}</span>
                                </div>}

                            </span>
                            {v.vacationState !== VacationStateEnum.Declined
                                && v.vacationState !== VacationStateEnum.Canceled
                                ? <button onClick={() => handleSelect(v)} style={{ marginRight: "5px" }}
                                    className="btn-base btn-decline">
                                    Cancel
                                </button>
                                : <span style={{ color: "#001d3d" }} className={"btn-base"}>No action</span>}
                        </div>
                    )
                })}


                {extensions?.count! > perPage &&
                    <Pager capacity={2} take={take} skip={skip} perPage={perPage} setSkip={setVacationsSkip}
                        extensions={extensions} setTake={setVacationsTake} />}
            </div>
        </>
    );
};


