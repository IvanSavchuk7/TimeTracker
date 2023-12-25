import "./misc.css";

export const ProfileAvatar = ({ initials }: { initials: string }) => {

    return (
        <div className="profile-avatar__wrapper">
            <span>{initials}</span>
        </div>
    );
};