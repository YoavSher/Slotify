import { usePlayPlaylistPreview } from "../../hooks/usePlayPlaylistPreview"
import { Playlist } from "../../interfaces/playlist"
import { useAppSelector } from "../../store/store.hooks"
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { FaPauseCircle } from 'react-icons/fa'
import { useNavigate } from "react-router-dom"

interface Props {
    playlistPre: Playlist
}

export const PlaylistPreview = ({ playlistPre }: Props) => {

    const navigate = useNavigate()
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const isMobile = screenWidth <= 770

    const { onSetPlaylist,  isPlaylistPlaying } = usePlayPlaylistPreview(playlistPre)

    const onGoToPlaylist=()=>{
        navigate(`playlist/${playlistPre._id}`)
    }
    return (
        <section className="playlist-preview" onClick={onGoToPlaylist}>
            <div className="img-container">
                <img src={playlistPre.image} alt="" />
                {!isMobile && <div className={isPlaylistPlaying() ? 'icon-container playing' : 'icon-container'}>
                    <button onClick={onSetPlaylist}>
                        <span>{isPlaylistPlaying() ? <FaPauseCircle /> : <BsFillPlayCircleFill />}</span>
                    </button>
                </div>}
                {/* {!isMobile && isPlaylistPlaying() && <div className='playlist-preview pause-container'>
                        <button onClick={onSetPlaylist}><span><FaPauseCircle /></span></button>
                    </div>} */}
            </div>
            <div className="playlist-info">
                <h3>{playlistPre.name}</h3>
            </div>
        </section>
    )
}