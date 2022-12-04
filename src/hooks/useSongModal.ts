import { CustomEvent } from '../interfaces/boundingRect'
import { Song } from '../interfaces/song'
import { useState } from 'react'

export const useSongModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [songForModal, setSongForModal] = useState<Song | null>(null)
    const [modalPos, setModalPos] = useState<{ left: number, top: number }>({ left: 0, top: 0 })

    const toggleModal = (ev: CustomEvent, song: Song) => {
        ev.stopPropagation() // the function needs a better name
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
    return { toggleModal, closeModal, isModalOpen, songForModal, modalPos }
}