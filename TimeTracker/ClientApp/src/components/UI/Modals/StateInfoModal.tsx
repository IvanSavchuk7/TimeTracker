import { useAppDispatch, useTypedSelector } from "@hooks/customHooks.ts";
import { closeInfoModal } from "@redux/slices/stateInfoModalSlice.ts";
import { useEffect } from 'react';
import { Loader } from '../Loaders/Loader';
import './StateInfoModal.css';
const StateInfoModal = () => {

    const { loading, message, animate, isOpen } = useTypedSelector(s => s.infoModal);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                dispatch(closeInfoModal());
            }, 2000)
        }
    }, [isOpen])



    return (
        <div className={`state-info-modal ${animate && 'animate'} ${message !== null ? message !== 'success' ? 'err' : 'success' : ''}`}
            style={{ display: `${loading || isOpen ? 'flex' : 'none'}` }}>
            {loading && <Loader />}
            <h4 style={{ fontSize: "25px", fontFamily: "sans-serif", textAlign: "center" }}>{message && message}</h4>
        </div>
    );
};

export default StateInfoModal;
