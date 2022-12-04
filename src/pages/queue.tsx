import { MouseEvent, MouseEventHandler, useState } from "react"
import { Helmet } from "react-helmet"
import { SongPreview } from "../cmps/song-preview-cmps/song-preview"
import { SongsModal } from "../cmps/songs-modal"
import { SongsQueueList } from "../cmps/songs-queue-list"
import { useSongModal } from "../hooks/useSongModal"
import { CustomEvent } from "../interfaces/boundingRect"
import { Song } from "../interfaces/song"
import { useAppSelector } from "../store/store.hooks"






export const Queue = () => {

    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const isMobile = screenWidth <= 770
    const { toggleModal, closeModal, isModalOpen, songForModal, modalPos } = useSongModal()
    const songs = useAppSelector(state => state.musicPlayer.currPlaylist.songs)
    const songIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)

    return (
        <>
            <Helmet><title>Slotify - Play Queue </title></Helmet>
            <section className="queue-page" onScroll={closeModal} onClick={closeModal}>
                <h3 className="title">Queue</h3>
                {songs[songIdx] && <><h4 className="mini-title">Now playing</h4>
                    <SongPreview screenWidth={screenWidth} toggleModal={toggleModal} song={songs[songIdx]} index={songIdx} type={'queue'} /></>}
                {songs.length > 0 && <><h4 className="mini-title">Next in queue</h4>
                    <SongsQueueList screenWidth={screenWidth} toggleModal={toggleModal} songIdx={songIdx} songs={songs} /></>}
            </section>
            {isModalOpen && songForModal && <SongsModal isMobile={isMobile} closeModal={closeModal} song={songForModal} modalPos={modalPos} />}
        </>
    )
}

