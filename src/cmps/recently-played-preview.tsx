import { Link } from 'react-router-dom'
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { FaPauseCircle } from 'react-icons/fa'
import { useAppSelector } from '../store/store.hooks'
import { Playlist } from '../interfaces/playlist'
import { usePlayPlaylistPreview } from '../hooks/usePlayPlaylistPreview'
import { useIsMobile } from '../hooks/useIsMobile'

interface Props {
    playlistPre: Playlist
}
export const RecentlyPlayedPreview = ({ playlistPre }: Props) => {
    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const { isMobile } = useIsMobile()

    const { onSetPlaylist, isThisPlaylist, isPlaylistPlaying } = usePlayPlaylistPreview(playlistPre, loggedInUser)

    return (
        <Link to={`playlist/${playlistPre._id}`}>
            <section className="recently-played-preview">
                <div className="recently-played-preview-container flex">
                    <div className="img-container">
                        <img src={playlistPre.image} alt="" />
                    </div>
                    <div className='recently-played-preview-content flex align-center justify-between'>
                        <div className='recently-played-preview-content title'>
                            <h1>{playlistPre.name}</h1>
                        </div>
                        {!isMobile &&
                            <div className={isPlaylistPlaying ?
                                'recently-played-preview-content icon-container playing' :
                                'recently-played-preview-content icon-container'}>
                                <button onClick={onSetPlaylist}>
                                    <span>{isPlaylistPlaying ? <FaPauseCircle /> : <BsFillPlayCircleFill />}</span>
                                </button>
                            </div>}
                        {isMobile && isPlaylistPlaying && <div>
                            <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt="" />
                        </div>}
                        {isMobile && isThisPlaylist && <div>
                            <h1 style={{ color: 'green', fontSize: '1.5rem' }}>...</h1>
                        </div>}
                    </div>
                </div>
            </section >
        </Link>
    )
}


