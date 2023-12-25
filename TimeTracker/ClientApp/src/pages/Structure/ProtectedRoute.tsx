import { useTypedSelector } from '@hooks/customHooks';
import { AccessDenied } from '..';

interface ProtectedRouteProps {
    permission: number,
    component: JSX.Element
}

export const ProtectedRoute = ({ permission, component }: ProtectedRouteProps) => {
    const state = useTypedSelector((state) => state.auth);

    return ((state.user!.permissions & permission) ?
        component : <AccessDenied />
    );
}