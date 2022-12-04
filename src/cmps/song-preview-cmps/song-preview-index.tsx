import { BiPlay } from "react-icons/bi"
import { GiPauseButton } from "react-icons/gi"
interface Props {
    isThisSongPlaying: boolean,
    isHover: boolean,
    index: number,
    onClickPlay: () => void
}

export const SongPreviewIndex = ({ isThisSongPlaying, isHover, index, onClickPlay }: Props) => {
    return (
        <div className="index-display">

            {isHover && (<button className={`play-pause-btn ${isThisSongPlaying ? 'pause' : 'play'}`}
                onClick={onClickPlay}>{isThisSongPlaying ? <GiPauseButton /> : <BiPlay />}</button>)}

            {!isThisSongPlaying && !isHover && <p>{index + 1}</p>}

            {isThisSongPlaying && !isHover && <div className="volume-gif">
                <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt=""
                />
            </div>}
        </div>
    )
}