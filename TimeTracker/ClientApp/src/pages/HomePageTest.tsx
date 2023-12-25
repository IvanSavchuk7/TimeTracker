import {useAppDispatch} from "@hooks/customHooks.ts";
import {fetchUsers, logout} from "@redux/slices";



export const HomePageTest = () => {
    const dispatch  = useAppDispatch();

    function useDis(){
        dispatch(logout());
    }
    return (
        <>
            <h1>Home</h1>
        </>
    );
};


/*
*
*  <span>Worked hours: {hoursToWork?.actuallyWorked}% / 100% ({hoursToWork?.actuallyWorkedHours}h/{hoursToWork?.needToWork}h)</span>
*
* */