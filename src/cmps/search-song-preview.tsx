import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { Song } from "../interfaces/song"
import { utilService } from "../services/util.service"

interface Props {
    song: Song,
}
export const SearchSongPreview = ({ song }: Props) => {


    return (<div className={`top-songs-results flex align-center justify-between`}>
        <div className="top-song flex align-center">
            <div className="img-container">
                <img src={song.image} alt="" />
            </div>
            <div className="song-description">
                <div className="song-title">
                    <h5>{song.title}</h5>

                </div>
                <h6>{song.artist}</h6>
            </div>
        </div>
        <div className="song-actions flex align-center">
            <p>{utilService.millisToMinutesAndSeconds(song.duration)}</p>
            {/* onClick={toggleModal} */}
            <button className="actions-btn">
                <span><HiOutlineDotsHorizontal /></span>
            </button>
            {/* {isModalOpen && <section className="options-modal">
                <button onClick={() => {
                    addSongToQueue()
                }}>Add to queue</button>
            </section>} */}
        </div>
    </div>

    )
}