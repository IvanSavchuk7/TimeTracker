import "./misc.css";

export const TabSwitcher = ({ tab, setter }: { tab: boolean, setter: (value: React.SetStateAction<boolean>) => void }) => {
    const onclick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setter(!tab);
    }

    return (
        <div className='tab-switch-wrapper'>
            <div className={tab ? "tab-switch left" : "tab-switch right"}>
                <div className={tab ? "tab active" : "tab"} onClick={onclick}>Plans</div>
                <div className={tab ? "tab" : "tab active"} onClick={onclick}>Events</div>
            </div>
        </div>
    )
}