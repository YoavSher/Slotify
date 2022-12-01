import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { Helmet } from "react-helmet"
import { BsFillPlayCircleFill } from "react-icons/bs"
import { CiClock2 } from "react-icons/ci"
import { RiHeartFill } from "react-icons/ri"
import { SongPreview } from "../cmps/song-preview"
import { SongsModal } from "../cmps/songs-modal"
import { Song } from "../interfaces/song"
import { setPlayingIdx, setPlaylist } from "../store/music-player/music-player.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { useState } from 'react'
import { setUser } from "../store/user/user.reducer"
import { userService } from "../services/user.service"

export const LikedSongs = () => {
    const dispatch = useAppDispatch()

    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const likedSongs = useAppSelector(state => state.user.likedSongs)
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [songForModal, setSongForModal] = useState<Song | null>(null)
    const [modalPos, setModalPos] = useState<{ left: number, top: number }>({ left: 0, top: 0 })


    const toggleModal = (ev: any, song: Song) => {
        ev.stopPropagation()
        const { left, top } = ev.target.getBoundingClientRect()
        setModalPos({ left, top })
        if (songForModal?.videoId === song.videoId) closeModal()
        else openModal(song)
    }

    const openModal = (song: Song) => {
        setSongForModal(song)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSongForModal(null)
        setIsModalOpen(false)
    }

    const onSetPlaylist = () => {
        if (loggedInUser && likedSongs) dispatch(setPlaylist({ songs: likedSongs }))
    }

    const playSongFromPlaylist = (index: number) => {
        onSetPlaylist()
        dispatch(setPlayingIdx(index))
    }
    console.log(likedSongs)
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
                {isModalOpen && <SongsModal closeModal={closeModal} song={songForModal} modalPos={modalPos} />}

            </section>
        </>
    )
    return <h1>SHTOK YA ZAIN</h1>
}