import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { Helmet } from "react-helmet"
import { BsFillPlayCircleFill } from "react-icons/bs"
import { CiClock2 } from "react-icons/ci"
import { RiHeartFill } from "react-icons/ri"
import { SongPreview } from "../cmps/song-preview-cmps/song-preview"
import { SongsModal } from "../cmps/songs-modal"
import { Song } from "../interfaces/song"
import { setPlayingIdx, setPlaylist } from "../store/music-player/music-player.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { useEffect, useState, MouseEvent, MouseEventHandler } from 'react'
import { setLikedSongs, setUser } from "../store/user/user.reducer"
import { userService } from "../services/user.service"
import { useSongModal } from "../hooks/useSongModal"
import { songService } from "../services/songs.service"
import { FaPauseCircle } from "react-icons/fa"
import { useMusicPlayerMethods } from "../hooks/useMusicPlayerMethods"
import { SongsTableHead } from "../cmps/playlist-details-cmps/songs-table-head"

export const LikedSongs = () => {

    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const likedSongs = useAppSelector(state => state.user.likedSongs)
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const isMobile = screenWidth <= 770
    const { toggleModal, closeModal, isModalOpen, songForModal, modalPos } = useSongModal()
    const LIKED_SONGS_PLAYLIST_ID = 0

    const {
        playSongFromPlaylist,
        onClickPlay, isCurrPlaylistPlaying } = useMusicPlayerMethods(LIKED_SONGS_PLAYLIST_ID, (likedSongs || []))

    return (
        <>
            <section onClick={closeModal} onScroll={closeModal} className="playlist-details liked-songs">
                <Helmet>
                    <title>Slotify - Liked songs</title>
                </Helmet>
                <header className="playlist-details-header flex">
                    <div className="img-container">
                        <div className="liked-songs-img"><span><RiHeartFill /></span></div>
                    </div>
                    <div className="playlist-description flex column">
                        <h3>PLAYLIST</h3>
                        <h2 className="playlist-title">Liked Songs</h2>
                        <h5>{loggedInUser?.fullName} • {likedSongs?.length} songs</h5>
                    </div>
                </header>
                <div className="playlist-details-main">
                    <div className="playlist-details-main action-btns flex align-center">
                        <button className="play-btn" onClick={onClickPlay}>
                            <span>{isCurrPlaylistPlaying ? <FaPauseCircle /> : <BsFillPlayCircleFill />}</span></button>

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
                {isModalOpen && songForModal && <SongsModal isMobile={isMobile} closeModal={closeModal} song={songForModal} modalPos={modalPos} />}

            </section>
        </>
    )
}