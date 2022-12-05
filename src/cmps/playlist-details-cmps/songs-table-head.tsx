import { CiClock2 } from "react-icons/ci"


export const SongsTableHead = ({ isMobile }: { isMobile: boolean }) => {
    return (<div className="songs-titles-container">
        {!isMobile && <div className="songs-titles">
            <div className="hash">#</div>
            <div className="title">TITLE</div>
            <div className="date">DATE ADDED</div>
            <div className="clock"><CiClock2 /></div>
        </div>}
    </div>)
}