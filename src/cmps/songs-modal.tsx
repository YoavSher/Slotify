import { useState, useEffect, MouseEventHandler, MouseEvent } from "react"

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
    // useEffect(() => {
    //     window.addEventListener('scroll', () => console.log('scrolling'))
    //     // return () => {
    //     //     window.removeEventListener('onscroll', closeModal)
    //     // }
    // }, [])
    const calcModalPos = () => {
        if (screenWidth !== undefined && screenWidth < 770) {
            return {
                left: '0',
                top: '0'
            }
        }
        return {
            // currently the height is 185 
            left: `${modalPos.left - 185}px`,
            top: `${modalPos.top + 10}px`
        }
    }

    const onOpenAddModal = (isOpen: boolean) => {
        if (isMobile()) return
        setAddModal(isOpen)
    }

    const toggleModalMobile = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation()
        if (!isMobile()) return
        console.log('mobile opening')
        setAddModal(prev => !prev)

    }
    console.log(modalPos)
    const isMobile = () => {
        return (screenWidth !== undefined && screenWidth < 770)
    }

    return (
        <>
            <section onClick={ev => { ev.stopPropagation(); closeModal() }} style={calcModalPos()} className={`${isMobile() ? 'mobile' : ''} options-modal`} onMouseLeave={() => onOpenAddModal(false)}>
                {isMobile() && <section className="mini-song">
                    <img src={song?.image} alt="" />
                    <p className="song-name">{song?.title}</p>
                    <p className="artist-name">{song?.artist}</p>
                </section>}
                <button onClick={addSongToQueue}>Add to queue</button>
                <button onClick={removeSongFromQueue}>Remove from queue</button>

                <button onClick={toggleModalMobile} onMouseOver={() => onOpenAddModal(true)} className="flex align-center justify-between">
                    Add to playlist <span><AiFillCaretRight /></span></button>
                {addModal &&
                    <AddToPlaylistModal
                        modalPos={modalPos}
                        onOpenAddModal={onOpenAddModal}
                        toggleModalMobile={toggleModalMobile}
                        song={song}
                        screenWidth={screenWidth} />}
            </section>

        </>
    )
}