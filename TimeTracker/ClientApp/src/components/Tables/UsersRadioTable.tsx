import { PickerDateRange } from "@components/UI/DateRangePicker/DateRangePicker";
import { SearchInput } from "@components/UI/Inputs/SearchInput";
import { RadioButton } from "@components/UI/RadioButtons/RadioButton";
import { useAppDispatch, useTypedSelector } from "@hooks/customHooks.ts";
import { addUsersFilters, fetchUsers, fetchWorkedHours, loadUsers, userFiltersToDefault } from '@redux/slices';
import { WhereFilter } from '@redux/types/filterTypes';
import { useEffect, useState } from 'react';
import { GetPickerDateRange } from '../../utils/dateTimeHelpers';
import "./usersTableSmall.css";


export const UsersRadioTable = ({ selectedUser, setSelectedUser, dateRange }: {
    selectedUser: number,
    setSelectedUser: React.Dispatch<React.SetStateAction<number>>,
    dateRange: PickerDateRange
}) => {

    const dispatch = useAppDispatch();
    const fieldsToSearch = ["Email", "FirstName", "LastName"];

    const authState = useTypedSelector(state => state.auth);
    const { loading, users, group, orderBy, extensions, perPage } = useTypedSelector(state => state.users);
    const calendarState = useTypedSelector(state => state.calendar);
    const { user } = useTypedSelector(state => state.auth)

    const [filtered, setFiltered] = useState<boolean>(false)
    const [progressAdded, setProgressAdded] = useState<boolean>(false)
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

    const handleResetProgress = () => {
        setSelectedUser(user!.id)
        dispatch(fetchWorkedHours({
            userId: user!.id,
            dateRange: GetPickerDateRange(dateRange)
        }))
        setProgressAdded(false)
    }

    const handleAddProgress = () => {
        dispatch(fetchWorkedHours({
            userId: selectedUser,
            dateRange: GetPickerDateRange(dateRange)
        }))
        if (selectedUser != user!.id)
            setProgressAdded(true)
    }

    return (
        <div className='radio-table-wrapper'>
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

            <div className='radio-list-wrapper'>
                <RadioButton options={users} selectedOption={selectedUser} setSelectedOption={setSelectedUser} />
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
                    <button className="btn" onClick={handleAddProgress}>
                        Review user's progress
                    </button>
                </div>
                {progressAdded &&
                    <div className='reset-user-button-wrapper'>
                        <button className="reset-btn" onClick={handleResetProgress}>
                            Reset
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};