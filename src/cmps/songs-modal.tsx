import { useState, useEffect, MouseEventHandler, MouseEvent } from "react"

import { AiFillCaretRight } from 'react-icons/ai'
import { useLocation } from "react-router-dom"
import { useSongLikingSystem } from "../hooks/useSongLikingSystem"

import { Song } from "../interfaces/song"
import { addToPlaylist, removeSong } from "../store/music-player/music-player.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { AddToPlaylistModal } from "./add-to-playlist-modal"

interface Props {
    song: Song,
    closeModal: any,
    modalPos: { left: number, top: number },
    isMobile: boolean,
    // type:string,
    // index?:number
}

export const SongsModal = ({ song, closeModal, modalPos, isMobile }: Props) => {
    //the first song of the queue shouldnt have the option to be removed from the queue ,
    // all rhe other songs in the queue should be and only them should have the option displayed of removing the idnex
    // inside a playlist should have the option to remove from this playlist,
    // i think a good way to handle it is to render a child prop that is like modalextended for each type of parent,
    // if it's queue or playlist-details or search and so on,

    const location = useLocation()

    const [addModal, setAddModal] = useState(false)
    const dispatch = useAppDispatch()
    const addSongToQueue = () => {
        if (song) dispatch(addToPlaylist(song))
        closeModal()
    }

    const { toggleSongLike, isSongLiked } = useSongLikingSystem(song)
    const likedSongs = useAppSelector(state => state.user.likedSongs)

    const removeSongFromQueue = () => {

        // generally if i have the index i should have no problem of removing
        // i just have to splice.
        closeModal()
    }

    const calcModalPos = () => {
        if (isMobile) return { left: '0', top: '0' }
        else return {
            // currently the height is 185 
            left: `${modalPos.left - 185}px`,
            top: `${modalPos.top + 10}px`
        }
    }

    const onOpenAddModal = (isOpen: boolean) => {
        if (isMobile) return
        setAddModal(isOpen)
    }

    const toggleModalMobile = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation()
        if (!isMobile) return
        setAddModal(prev => !prev)

    }

    console.log(location)
    return (
        <>
            <section onClick={ev => { ev.stopPropagation(); closeModal() }} style={calcModalPos()}
                className={`${isMobile ? 'mobile' : ''} options-modal`} onMouseLeave={() => onOpenAddModal(false)}>
                {isMobile && <section className="mini-song">
                    <img src={song?.image} alt="" />
                    <p className="song-name">{song?.title}</p>
                    <p className="artist-name">{song?.artist}</p>
                </section>}
                <button onClick={addSongToQueue}>Add to queue</button>
                <button onClick={removeSongFromQueue}>Remove from queue</button>
                {likedSongs && <button onClick={toggleSongLike} >{(isSongLiked) ? 'Remove song from liked songs' : 'Add song to liked songs'}</button>}
                <button onClick={toggleModalMobile} onMouseOver={() => onOpenAddModal(true)} className="flex align-center justify-between">
                    Add to playlist <span><AiFillCaretRight /></span></button>
                {addModal &&
                    <AddToPlaylistModal
                        modalPos={modalPos}
                        onOpenAddModal={onOpenAddModal}
                        toggleModalMobile={toggleModalMobile}
                        song={song}
                        isMobile={isMobile} />}
            </section>

        </>
    )
}