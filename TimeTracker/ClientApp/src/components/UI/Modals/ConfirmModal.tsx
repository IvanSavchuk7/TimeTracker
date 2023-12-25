import { useState } from 'react';
import { SmallButton } from "../../UI/Buttons/SmallButton";
import "./modals.css";

interface ConfirmModalProps {
    title: string,
    description: string,
    onConfirm: (value: any) => void
    value: any,
}

export const ConfirmModal = ({ title, description, onConfirm, value }: ConfirmModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleConfirm = () => {
        onConfirm(value);
        handleOpenCloseModal();
    }

    const handleOpenCloseModal = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="modal-wrapper">
            <button className="modal-open-close__btn" onClick={handleOpenCloseModal}></button>
            <div className="modal-window__wrapper" style={isOpen ? { display: 'flex' } : { display: 'none' }}>
                <div className="modal-window__content">
                    <h2>{title}</h2>
                    <p>{description}</p>
                    <div className="modal-btn__wrapper">
                        <SmallButton type="submit" value="Yes" handleClick={handleConfirm} />
                        <SmallButton type="submit" value="Cancel" handleClick={handleOpenCloseModal} />
                    </div>
                </div>
            </div>
        </div>
    );
};