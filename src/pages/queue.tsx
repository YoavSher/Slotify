import { Helmet } from "react-helmet"
import { ActionMsg } from "../cmps/action-msg"

import { SongPreview } from "../cmps/song-preview-cmps/song-preview"
import { SongsModal } from "../cmps/songs-modal"
import { SongsQueueList } from "../cmps/songs-queue-list"
import { useShowActionMsg } from "../hooks/useShowActionMsg"
import { useSongModal } from "../hooks/useSongModal"
import { useAppSelector } from "../store/store.hooks"






export const Queue = () => {

    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const isMobile = screenWidth <= 770
    const { toggleModal, closeModal, isModalOpen, songForModal, modalPos } = useSongModal()
    const songs = useAppSelector(state => state.musicPlayer.songs)
    const currPlayingIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const { msg, showActionMsg } = useShowActionMsg()

    return (
        <>
            <Helmet><title>Slotify - Play Queue </title></Helmet>

            <section className="queue-page" onScroll={closeModal} onClick={closeModal}>
                <h3 className="title">Queue</h3>
                {songs[currPlayingIdx] && <><h4 className="mini-title">Now playing</h4>
                    <SongPreview screenWidth={screenWidth} toggleModal={toggleModal} song={songs[currPlayingIdx]} index={currPlayingIdx} type={'queue'} /></>}
                {songs.length > 0 && <><h4 className="mini-title">Next in queue</h4>
                    <SongsQueueList screenWidth={screenWidth} toggleModal={toggleModal} songIdx={currPlayingIdx} songs={songs} /></>}
            </section>
            {isModalOpen && songForModal && <SongsModal isMobile={isMobile} closeModal={closeModal} song={songForModal} modalPos={modalPos} showActionMsg={showActionMsg} />}
            {msg && <ActionMsg msg={msg} />}
        </>
    )
}

