import { ProfileAvatar } from "@components/UI/Misc/ProfileAvatar";
import { useAppDispatch } from "@hooks/customHooks.ts";
import { deleteUser, setUsersOrdering, User } from "../../redux";
import "./tables.css";


export const UsersTable = ({ users }: { users: User[] }) => {

    const dispatch = useAppDispatch()

    const handleConfirmButtonClick = (value: number) => {
        const conf = confirm("Are you sure?")
        if (conf) {
            dispatch(deleteUser(value));
        }
    };

    function setOrderBy(prop: string) {
        dispatch(setUsersOrdering(prop));
    }

    return (
        <div className="table-wrapper__inner">
            <table className="users-table__table">
                <thead>
                    <tr>
                        <th></th>
                        <th>User</th>
                        <th onClick={() => setOrderBy("Email")}>Email</th>
                        <th onClick={() => setOrderBy("VacationDays")}>Vacation Days</th>
                        <th onClick={() => setOrderBy("HoursPerMonth")}>Working hours</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (

                        <tr key={user.id}>
                            <td>
                                <ProfileAvatar initials={`${user.firstName[0]}${user.lastName[0]}`} />
                            </td>
                            <td className="table__name-col">
                                <span className="table__name-col__fullname">{user.firstName} {user.lastName}</span>
                            </td>
                            <td>
                                <span>{user.email}</span>
                            </td>
                            <td>
                                <span>{user.vacationDays}</span>
                            </td>
                            <td>
                                <span>{user.hoursPerMonth}</span>
                            </td>
                            <td>
                                <div className="users-table__actions-wrapper">
                                    <div className="users-table__actions-edit">
                                        <a href={`/team/edituser/${user.id}`} />
                                    </div>
                                    <div className="users-table__actions-archieve" onClick={() => handleConfirmButtonClick(user.id)}>

                                    </div>

                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};