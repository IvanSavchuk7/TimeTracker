
import { VacationsTable } from "@components/Tables/VacationsTable.tsx";
import { useTypedSelector } from '@hooks/customHooks';
import { Permission } from '@redux/enums';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import {
  AddUser,
  EditUser,
  EmailConfirm,
  Layout,
  Login,
  NotFound,
  ProtectedRoute,
  Team,
  UserVerify,
  VacationRequests
} from "..";
import Calendar from "../CalendarPage/Calendar";
import { Dashboard } from '../DashboardPage/Dashboard';
import { HomeTwo } from "../HomeTwo.tsx";
import React from "react";
import PasswordRecovery from "@pages/PasswordRecoveryPage/PasswordRecovery.tsx";
import AuthPage from "@pages/AuthPage.tsx";
import SettingsCard from "@components/Settings/SettingsCard.tsx";






export const AppRoutes = () => {
  const state = useTypedSelector((state) => state.auth);

  return (
    <Routes>
      {state.status ? (
        <>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomeTwo />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path="/external-auth" element={<AuthPage />} />
            <Route path="/settings" element={<SettingsCard />} />
            <Route path="/team" element={<Outlet />}>
              <Route index element={<Team />} />
              <Route path="addUser"
                element={
                  <ProtectedRoute
                    component={<AddUser />}
                    permission={Permission.Create}
                  />
                }
              />
              <Route path="editUser/:userId"
                element={
                  <ProtectedRoute
                    component={<EditUser />}
                    permission={Permission.Update}
                  />
                }
              />
            </Route>
            <Route path="/vacation">
              <Route index element={<Navigate to='requests' />} />
              <Route path="requests" element={<VacationRequests />} />
              <Route path="all" element={<VacationsTable />} />
            </Route>
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </>
      ) : (
        <>
          <Route path="/userVerify" element={<UserVerify />} />
          <Route path="/external-auth" element={<AuthPage />} />
          <Route path="/emailConfirm" element={<EmailConfirm />} />
          <Route path="/passwordRecovery" element={<PasswordRecovery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
};