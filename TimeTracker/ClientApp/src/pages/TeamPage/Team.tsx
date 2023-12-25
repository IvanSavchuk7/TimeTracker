import "@components/UI/Buttons/buttons.css";
import { useEffect } from 'react';
import { useAppDispatch, useTypedSelector } from "../../hooks";
import { fetchUsers, removeUserFilter, setUsersSkip, setUsersTake } from "../../redux";
import "./Team.css";

import { H4 } from "@components/Headings";
import Pager from "@components/Paging/Pager.tsx";
import { UsersTable } from "@components/Tables/UsersTable";
import { UsersTableNavbar } from "@components/Tables/UsersTableNavbar";
import { Loader } from "@components/UI/Loaders/Loader";
import { WhereFilter } from "@redux/types/filterTypes.ts";

export const Team = () => {
    const dispatch = useAppDispatch();
    const authState = useTypedSelector(state => state.auth);
    const { loading, users, group, skip, perPage, orderBy, take, count } = useTypedSelector(state => state.users);

    const loadMore = () => {
        dispatch(fetchUsers({
            take: take,
            skip: skip,
            userId: authState.user?.id!,
            group: group,
            orderBy: orderBy
        }));
    }

    useEffect(() => {
        loadMore();
    }, [group, take, skip, orderBy])



    function handleRemoveFilter(filter: WhereFilter) {
        dispatch(removeUserFilter(filter.property));
    }

    return (
        <div className="team-menu__wrapper">
            <div className="team-menu__wrapper-inner">
                <div className="team-menu__header-wrapper">
                    <H4 value="Members" />
                    <div className="filters-wrapper">
                        {group.map(f => {
                            return <span key={f.property} onClick={() => handleRemoveFilter(f)}
                                className="btn-base btn-info">{f.property} X</span>
                        })}
                    </div>
                </div>

                <div className="team-menu__main">
                    <div className="users-table__wrapper">
                        <UsersTableNavbar />
                        {loading ? <Loader /> :
                            <>
                                <UsersTable users={users} />
                            </>
                        }
                    </div>
                </div>
                {count>perPage&&
                    <Pager bottom={"0"} capacity={2} skip={skip} take={take} setSkip={setUsersSkip} setTake={setUsersTake}
                           extensions={{count:count}} perPage={perPage} />
                }

            </div>
        </div>
    );
};