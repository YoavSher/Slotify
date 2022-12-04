import { BiPlay } from "react-icons/bi"
import { GiPauseButton } from "react-icons/gi"

interface Props {
    image: string,
    onClickPlay: () => void,
    isThisSongPlaying: boolean,
    type: string,
}


export const SongPreviewImage = ({ image, onClickPlay, isThisSongPlaying, type }: Props) => {
    return (
        <div className="img-container">

            <img src={image} alt="" />

            {(type === 'search-results' || type === 'playlist-details-search') && (
                <button className="photo-play" onClick={onClickPlay}>
                    <span>{isThisSongPlaying ? <GiPauseButton /> : <BiPlay />}</span>
                </button>)}
        </div>
    )
}