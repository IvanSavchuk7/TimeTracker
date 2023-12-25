import { DashboardScheduler } from '@components/DashboardScheduler/DashboardScheduler';
import './dashboard.css';

export const Dashboard = () => {
    return (
        <div className='dashboard-page__wrapper'>
            <DashboardScheduler />
        </div>
    )
}