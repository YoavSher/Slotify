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
import { useEffect, useState } from 'react'
import { setLikedSongs, setUser } from "../store/user/user.reducer"
import { userService } from "../services/user.service"
import { useSongModal } from "../hooks/useSongModal"
import { songService } from "../services/songs.service"

export const LikedSongs = () => {
    const dispatch = useAppDispatch()

    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const likedSongs = useAppSelector(state => state.user.likedSongs)
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const isMobile = screenWidth <= 770
    const { toggleModal, closeModal, isModalOpen, songForModal, modalPos } = useSongModal()
    const LIKED_SONGS_PLAYLIST_ID = 0

    useEffect(() => {
        // loadSongs()
    }, [])
    const loadSongs = async () => {
        if (loggedInUser) {
            try {
                const songs = await songService.getLikedSongs(loggedInUser._id)
                if (songs) dispatch(setLikedSongs(songs))
            } catch (err) {
                console.log('err:', err)
            }
        }
    }

    //maybe the screensiwdth should be a hook that returns isMobile directly and all the components can just use this
    const onSetPlaylist = () => {
        if (loggedInUser && likedSongs) {
            dispatch(setPlaylist({ songs: likedSongs, playlistId: LIKED_SONGS_PLAYLIST_ID }))
        }
    }

    const playSongFromPlaylist = (index: number) => {
        onSetPlaylist()
        dispatch(setPlayingIdx(index))
    }

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
                        <button className="play-btn" onClick={onSetPlaylist}><span><BsFillPlayCircleFill /></span></button>
                    </div>
                    <div className="playlist-details-main-content">
                        <div className="songs-titles-container">
                            <div className="songs-titles">
                                <div className="hash">#</div>
                                <div className="title">TITLE</div>
                                <div className="date">DATE ADDED</div>
                                <div className="clock"><CiClock2 /></div>
                            </div>
                        </div>

                        <div className="songs-container">
                            {likedSongs?.map((s, idx) => {
                                return <SongPreview key={s.videoId} screenWidth={screenWidth} playSongFromPlaylist={playSongFromPlaylist} song={s} toggleModal={toggleModal} index={idx} type={'playlist-details'} />
                            })}
                        </div>
                    </div>
                </div>
                {isModalOpen && songForModal && <SongsModal isMobile={isMobile} closeModal={closeModal} song={songForModal} modalPos={modalPos} />}

            </section>
        </>
    )
}