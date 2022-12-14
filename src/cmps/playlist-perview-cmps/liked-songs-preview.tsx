import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../store/store.hooks"
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { FaPauseCircle } from 'react-icons/fa'
import { useMusicPlayerMethods } from "../../hooks/useMusicPlayerMethods"

import { RiHeartFill } from "react-icons/ri"
import { useIsMobile } from "../../hooks/useIsMobile"

export const LikedSongsPreview = () => {
    const navigate = useNavigate()
    const likedSongs = useAppSelector(state => state.user.likedSongs)
    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const { isMobile } = useIsMobile()
    const LIKED_SONGS_PLAYLIST_ID = 0
    const pseudoPlaylist = {
        _id: LIKED_SONGS_PLAYLIST_ID,
        name: 'Liked songs',
        image: '',
        creatorId: loggedInUser?._id || 0,
        fullName: loggedInUser?.fullName || ''
    }
    const {
        onClickPlay, isCurrPlaylistPlaying } = useMusicPlayerMethods(pseudoPlaylist, (likedSongs || []), loggedInUser)

    const onGoToPlaylist = () => {
        navigate(`/liked-songs`)
    }
    if (!likedSongs) return <h1>Loading</h1>
    return (
        <section className="liked-songs-preview flex column" onClick={onGoToPlaylist}>
            {!isMobile && <>
                <div className="content-artist">
                    {likedSongs.map(s => {
                        return <h4>
                            <span className="artist">{s.artist}</span>
                            <span className="song"> {s.title} •</span>
                        </h4>
                    })}
                </div>
                <div className="description">
                    <h1>Liked Songs</h1>
                    <h5>{likedSongs.length} liked songs</h5>
                </div>
                <div className={isCurrPlaylistPlaying ? 'icon-container playing' : 'icon-container'}>
                    <button onClick={onClickPlay}>
                        <span>{isCurrPlaylistPlaying ? <FaPauseCircle /> : <BsFillPlayCircleFill />}</span>
                    </button>
                </div>
            </>}
            {isMobile && <>
                <div className="img-container">
                    <span><RiHeartFill /></span>
                </div>
                <div className="playlist-info">
                    <h3>Liked Songs</h3>
                </div>
            </>}
        </section>
    )
}