import { useEffect, useState } from 'react'
import { Helmet } from "react-helmet"
import { BsFillPlayCircleFill } from "react-icons/bs"
import { RiHeartFill } from "react-icons/ri"
import { SongPreview } from "../cmps/song-preview-cmps/song-preview"
import { SongsModal } from "../cmps/songs-modal"
import {  useAppSelector } from "../store/store.hooks"
import { useSongModal } from "../hooks/useSongModal"
import { FaPauseCircle } from "react-icons/fa"
import { BiShuffle } from 'react-icons/bi'
import { useMusicPlayerMethods } from "../hooks/useMusicPlayerMethods"
import { SongsTableHead } from "../cmps/playlist-details-cmps/songs-table-head"
import { useCheckLoggedInUser } from "../hooks/useCheckLoggedInUser"
import { useIsMobile } from "../hooks/useIsMobile"
import { useShowActionMsg } from "../hooks/useShowActionMsg"
import { useSongsShuffle } from "../hooks/useSongsShuffle"
import { utilService } from "../services/util.service"

export const LikedSongs = () => {

    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const likedSongs = useAppSelector(state => state.user.likedSongs)
    const currPlayingIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const queueSongs = useAppSelector(state => state.musicPlayer.songs)
    const { isMobile, screenWidth } = useIsMobile()
    const { toggleModal, closeModal, isModalOpen, songForModal, modalPos } = useSongModal()
    const { isShuffled, toggleSongsShuffle } = useSongsShuffle(queueSongs, currPlayingIdx)
    const [songsDuration, setSongsDuration] = useState('')
    const LIKED_SONGS_PLAYLIST_ID = 0
    useCheckLoggedInUser()
    const pseudoPlaylist = {
        _id: LIKED_SONGS_PLAYLIST_ID,
        name: 'Liked songs',
        image: '',
        creatorId: loggedInUser?._id || 0,
        fullName: loggedInUser?.fullName || ''
    }
    const {
        playSongFromPlaylist,
        onClickPlay,
        isCurrPlaylistPlaying } = useMusicPlayerMethods(pseudoPlaylist, (likedSongs || []), loggedInUser)
    const { msg, showActionMsg } = useShowActionMsg()
    useEffect(() => {
        getSongsDuration()
    }, [])
    const getSongsDuration = () => {
        let duration = 0
        likedSongs?.forEach(s => duration += s.duration)
        const totalDuration = utilService.getTotalSongsDuration(duration)
        setSongsDuration(totalDuration)
    }

    return (
        <>
            <section onClick={closeModal} onScroll={closeModal} className="playlist-details liked-songs">
                <Helmet>
                    <title>Slotify - Liked songs</title>
                </Helmet>
                <header className="playlist-details-header flex">
                    <div className="liked-songs img-container">
                        <div className="liked-songs-img"><span><RiHeartFill /></span></div>
                    </div>
                    <div className="playlist-description flex column">
                        <h3>PLAYLIST</h3>
                        <h2 className="playlist-title">Liked Songs</h2>
                        <h5>{loggedInUser?.fullName}
                            {likedSongs && likedSongs?.length > 0 &&
                                <><span> • {likedSongs?.length} songs, </span>
                                    <span style={{ 'opacity': 0.7 }}>{songsDuration}</span></>}
                        </h5>
                    </div>
                </header>
                <div className="playlist-details-main">
                    <div className="playlist-details-main action-btns flex align-center">
                        <div className="start-btns">
                            <button className="play-btn" onClick={onClickPlay}>
                                <span>{isCurrPlaylistPlaying ? <FaPauseCircle /> : <BsFillPlayCircleFill />}</span></button>
                            {isMobile && <button className={`shuffle-btn ${(isShuffled) ? 'shuffled' : ''}`}
                                onClick={toggleSongsShuffle}>
                                <span ><BiShuffle /></span>
                            </button>}
                        </div>
                    </div>
                    <div className="playlist-details-main-content">
                        {likedSongs && likedSongs.length > 0 && < SongsTableHead isMobile={isMobile} />}
                        <div className="songs-container">
                            {likedSongs?.map((s, idx) => {
                                return <SongPreview key={s.videoId} screenWidth={screenWidth}
                                    playSongFromPlaylist={playSongFromPlaylist} song={s}
                                    toggleModal={toggleModal} index={idx} type={'playlist-details'} />
                            })}
                        </div>
                    </div>
                </div>
                {isModalOpen && songForModal && <SongsModal isMobile={isMobile}
                    closeModal={closeModal} song={songForModal} modalPos={modalPos} showActionMsg={showActionMsg} />}

            </section>
        </>
    )
}

