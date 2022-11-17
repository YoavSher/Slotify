import { MouseEvent, MouseEventHandler, useState } from "react"
import { Helmet } from "react-helmet"
import { SearchSongPreview } from "../cmps/search-song-preview"
import { SongPreview } from "../cmps/song-preview"
import { SongsModal } from "../cmps/songs-modal"
import { SongsQueueList } from "../cmps/songs-queue-list"
import { Song } from "../interfaces/song"
import { useAppSelector } from "../store/store.hooks"


export const Queue = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [songForModal, setSongForModal] = useState<Song | null>(null)
    const [modalPos, setModalPos] = useState<{ left: number, top: number }>({ left: 0, top: 0 })

    // const openModal = (ev:  MouseEvent<HTMLButtonElement>, song: Song) => {
    const openModal = (ev:  any, song: Song) => {
        ev.stopPropagation()
        const { left, top } = ev.target.getBoundingClientRect()
        setModalPos({ left, top })
        setSongForModal(song)
        setIsModalOpen(true)
    }
    const closeModal = () => {
        setSongForModal(null)
        setIsModalOpen(false)
    }




    const songs = useAppSelector(state => state.musicPlayer.currPlaylist.songs)
    const songIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)

    return (
        <>
        <Helmet><title>Slotify - Play Queue </title></Helmet>
            <section className="queue-page" onClick={closeModal}>
                <h3 className="title">Queue</h3>
                {songs[songIdx] && <><h4 className="mini-title">Now playing</h4>
                    <SongPreview openModal={openModal} song={songs[songIdx]} index={songIdx} type={'queue'} /></>}
                {songs.length > 0 && <><h4 className="mini-title">Next in queue</h4>
                    <SongsQueueList openModal={openModal} songIdx={songIdx} songs={songs} /></>}
            </section>
            {isModalOpen && <SongsModal closeModal={closeModal} song={songForModal} modalPos={modalPos} />}
        </>
    )
}