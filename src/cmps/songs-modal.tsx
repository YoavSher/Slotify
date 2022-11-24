import { useState, useEffect } from "react"

import { AiFillCaretRight } from 'react-icons/ai'

import { Song } from "../interfaces/song"
import { addToPlaylist, removeSong } from "../store/music-player/music-player.reducer"
import { useAppDispatch } from "../store/store.hooks"
import { AddToPlaylistModal } from "./add-to-playlist-modal"

interface Props {
    song: Song | null,
    closeModal: any,
    modalPos: { left: number, top: number },
    screenWidth?: number
}

export const SongsModal = ({ song, closeModal, modalPos, screenWidth }: Props) => {


    const [addModal, setAddModal] = useState(false)
    const dispatch = useAppDispatch()
    const addSongToQueue = () => {
        if (song) dispatch(addToPlaylist(song))
        closeModal()
    }
    const removeSongFromQueue = () => {
        if (song) dispatch(removeSong(song.id))
        closeModal()
    }

    const calcModalPos = () => {
        if (screenWidth !== undefined && screenWidth < 770) {
            return {
                left: `${modalPos.left - 200}px`,
                top: `${modalPos.top - 10}px`
            }
        }
        return {
            left: `${modalPos.left - 365}px`,
            top: `${modalPos.top - 10}px`
        } /// needs to add consideration for the height but the left is fixed,
    }

    const onOpenAddModal = (isOpen: boolean) => {
        setAddModal(isOpen)
    }

    return (
        <>
            <section style={calcModalPos()} className="options-modal" onMouseLeave={() => onOpenAddModal(false)}>
                <button onClick={addSongToQueue}>Add to queue</button>
                <button onClick={removeSongFromQueue}>Remove from queue</button>
                <button onMouseOver={() => onOpenAddModal(true)} className="flex align-center justify-between">
                    Add to playlist <span><AiFillCaretRight /></span></button>
            </section>
            {addModal &&
                <AddToPlaylistModal
                    modalPos={modalPos}
                    onOpenAddModal={onOpenAddModal}
                    song={song} 
                    screenWidth={screenWidth}/>}
        </>
    )
}