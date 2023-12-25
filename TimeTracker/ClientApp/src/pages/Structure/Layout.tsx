import { Header } from "@components/Header/Header";
import { Sidebar } from "@components/Sidebar/Sidebar";
import StateInfoModal from "@components/UI/Modals/StateInfoModal.tsx";
import { Outlet } from "react-router-dom";
import "./Layout.css";





export const Layout = () => {
    return (
        <div className="layout-wrapper">
            <div className="layout-logo__wrapper">
                <div className="layout-logo__wrapper-inner">
                    <a href="/">
                    </a>
                </div>
            </div>
            <div className="layout-header__wrapper">
                <Header />
            </div>
            <div className="layout-sidebar__wrapper">
                <Sidebar />
            </div>
            <div className="layout-content__wrapper">
                <main>
                    <Outlet />
                </main>
            </div>
            <StateInfoModal />
        </div>
    )
};
