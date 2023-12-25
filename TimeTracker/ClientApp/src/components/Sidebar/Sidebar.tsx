import { useDispatch } from "react-redux";
import { logout } from "../../redux";
import { Hr } from "../UI/Misc/Hr";
import "./Sidebar.css";

export const Sidebar = () => {

    const dispatch = useDispatch();

    return (
        <div className="sidebar-wrapper">
            <nav>
                <ul className="sidebar-list">

                    <li>
                        <a href="/calendar" className="sidebar-list__link">
                            <div className="sidebar-list__image-wrapper"><div className="calendar-img__wrapper"></div></div>
                            <span>Calendar</span>
                        </a>
                    </li>

                    <li>
                        <a href="/dashboard" className="sidebar-list__link">
                            <div className="sidebar-list__image-wrapper"><div className="dashboard-img__wrapper"></div></div>
                            <span>Dashboard</span>
                        </a>
                    </li>

                    <li>
                        <a href="/vacation/all" className="sidebar-list__link">
                            <div className="sidebar-list__image-wrapper"><div className="vacations-img__wrapper"></div></div>
                            <span>My vacations</span>
                        </a>
                    </li>

                    <li>
                        <a href="/vacation/requests" className="sidebar-list__link">
                            <div className="sidebar-list__image-wrapper"><div className="requests-img__wrapper"></div></div>
                            <span>Requests</span>
                        </a>
                    </li>

                    <Hr />

                    <li>
                        <a href="/team" className="sidebar-list__link">
                            <div className="sidebar-list__image-wrapper"><div className="team-img__wrapper"></div></div>
                            <span>Team</span>
                        </a>
                    </li>

                    <li>
                        <a href="/settings" className="sidebar-list__link">
                            <div className="sidebar-list__image-wrapper"><div className="settings-img__wrapper"></div></div>
                            <span>Settings</span>
                        </a>
                    </li>

                    <li className="sidebar-list__logout-link">
                        <button onClick={() => { dispatch(logout()); }} className="sidebar-list__link sidebar-logout__btn">
                            <div className="sidebar-list__image-wrapper"><div className="logout-img__wrapper"></div></div>
                            <span>Log out</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};