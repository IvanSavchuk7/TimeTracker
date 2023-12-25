import { Checkbox } from "@components/UI/Checkboxes/Checkbox";
import { SearchInput } from "@components/UI/Inputs/SearchInput";
import { useAppDispatch, useTypedSelector } from "@hooks/customHooks.ts";
import { addUsersFilters, fetchUsers, fetchWorkPlans, loadUsers, resetUsersWorkPlans, userFiltersToDefault } from '@redux/slices';
import { WhereFilter } from '@redux/types/filterTypes';
import { useEffect, useState } from 'react';
import { GetOneMonthDateRange } from '../../utils/dateTimeHelpers';
import "./usersTableSmall.css";


export const UsersTableSmall = ({selectedUsers, setSelectedUsers} : {selectedUsers: number[], setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>}) => {

    const dispatch = useAppDispatch();
    const fieldsToSearch = ["Email", "FirstName", "LastName"];

    const authState = useTypedSelector(state => state.auth);
    const { loading, users, group, orderBy, extensions, perPage } = useTypedSelector(state => state.users);
    const calendarState = useTypedSelector(state => state.calendar);
    const { user } = useTypedSelector(state => state.auth)

    const [filtered, setFiltered] = useState<boolean>(false)
    const [plansAdded, setPlansAdded] = useState<boolean>(false)
    const [take, setTake] = useState<number>(10)

    useEffect(() => {
        reload();
    }, [])

    useEffect(() => {
        if (group.length)
            dispatch(fetchUsers({
                userId: authState.user?.id!,
                group: group,
                orderBy: orderBy
            }));
    }, [group])

    const loadMore = () => {
        setTake(users.length + 10);
        dispatch(loadUsers({
            take: users.length + 10,
            skip: users.length,
            userId: authState.user?.id!,
            group: group,
            orderBy: orderBy
        }));
    }

    const reload = () => {
        dispatch(fetchUsers({
            take: take,
            userId: authState.user?.id!,
            group: [],
            orderBy: orderBy
        }));
    }

    const handleSearch = (search: string) => {
        dispatch(userFiltersToDefault());
        const filters: WhereFilter[] = [];

        for (const field of fieldsToSearch) {
            filters.push({ property: field, operator: "contains", value: search, connector: "or" });
        }

        dispatch(addUsersFilters(filters));
        setFiltered(true)
    }

    const handleResetFilter = () => {
        dispatch(userFiltersToDefault())
        reload();
        setFiltered(false)
    }

    const handleResetPlans = () => {
        setSelectedUsers([])
        dispatch(resetUsersWorkPlans(user!.id))
        setPlansAdded(false)
    }

    const handleSelect = (value: number, checked: boolean) => {
        const selectedUsersArr = checked
            ? [...selectedUsers, value]
            : selectedUsers.filter((id) => id !== value);

        setSelectedUsers(selectedUsersArr)
    }

    const handleAddPlans = () => {
        dispatch(fetchWorkPlans({
            dateRange: GetOneMonthDateRange(calendarState.currentDate),
            userIds: selectedUsers
        }))
        setPlansAdded(true)
    }

    return (
        <div className='small-users-table-wrapper'>
            <div className='search-header'>
                <div className='search-input-wrapper'>
                    <SearchInput name="search" placeholder="Search" onSearch={handleSearch} />
                </div>

                {filtered &&
                    <div className='reset-button-wrapper'>
                        <button className="reset-btn" onClick={handleResetFilter}>
                            Reset
                        </button>
                    </div>
                }
            </div>

            <div className='users-list-wrapper'>
                {users.map(u =>
                    <div key={u.id} >
                        <Checkbox value={u.id} optionName={`${u.firstName} ${u.lastName}`} isChecked={selectedUsers.includes(u.id)} onChange={handleSelect} />
                    </div>
                )}
            </div>
            {!filtered && !(users.length % 10) &&
                <div className='pager-wrapper'>
                    <div className='add-user-button-wrapper'>
                        <button className="btn" onClick={loadMore}>
                            Load more
                        </button>
                    </div>
                </div>
            }

            <div className='table-controls-wrapper'>
                <div className='add-user-button-wrapper'>
                    <button className="btn" onClick={handleAddPlans}>
                        Add users' plans
                    </button>
                </div>
                {plansAdded &&
                    <div className='reset-user-button-wrapper'>
                        <button className="reset-btn" onClick={handleResetPlans}>
                            Reset
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};