import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../store/store.hooks"
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { FaPauseCircle } from 'react-icons/fa'
import { useMusicPlayerMethods } from "../../hooks/useMusicPlayerMethods"

import { RiHeartFill } from "react-icons/ri"

export const LikedSongsPreview = () => {
    const navigate = useNavigate()
    const likedSongs = useAppSelector(state => state.user.likedSongs)
    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const isMobile = screenWidth <= 770
    const LIKED_SONGS_PLAYLIST_ID = 0

    const {
        onClickPlay, isCurrPlaylistPlaying } = useMusicPlayerMethods(LIKED_SONGS_PLAYLIST_ID, (likedSongs || []))

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