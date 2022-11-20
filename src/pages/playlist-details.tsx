import { ChangeEvent, FocusEvent, MouseEvent, MouseEventHandler, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Helmet } from 'react-helmet'

import { BsFillPlayCircleFill } from 'react-icons/bs'
import { FiEdit2 } from 'react-icons/fi'
import { CiClock2 } from 'react-icons/ci'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'

import { Playlist } from "../interfaces/playlist"
import { playlistService } from "../services/playlist.service"
import { uploadService } from "../services/upload.service"
import { SongPreview } from "../cmps/song-preview"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { setPlaylist } from "../store/music-player/music-player.reducer"
import { SongsModal } from "../cmps/songs-modal"
import { Song } from "../interfaces/song"

export const PlaylistDetails = () => {

    const params = useParams()
    const { playlistId } = params
    const navigate = useNavigate()

    const [currPlaylist, setCurrPlaylist] = useState<Playlist>()
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [songForModal, setSongForModal] = useState<Song | null>(null)
    const [modalPos, setModalPos] = useState<{ left: number, top: number }>({ left: 0, top: 0 })

    const toggleModal = (ev: any, song: Song) => {
        ev.stopPropagation()
        const { left, top } = ev.target.getBoundingClientRect()
        setModalPos({ left, top })
        if (songForModal?.id === song.id) closeModal()
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


    const dispatch = useAppDispatch()
    const songIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)

    useEffect(() => {
        loadPlaylist()
        console.log('playlist:', currPlaylist?.createdBy.fullName)
    }, [])

    const loadPlaylist = async () => {
        if (playlistId) {
            try {
                const playlist = await playlistService.getPlaylistById(playlistId)

                setCurrPlaylist(playlist)

            } catch (err) {
                console.log('err:', err)
            }
        }
    }

    const onChangeTitle = async (ev: FocusEvent<HTMLInputElement>) => {
        const { value } = ev.target
        if (currPlaylist) {
            currPlaylist.name = value
            await playlistService.updatePlaylist(currPlaylist)
            loadPlaylist()
        }
    }

    const onChangePhoto = async (ev: ChangeEvent<HTMLInputElement>) => {
        if (currPlaylist) {
            const newPhoto = await uploadService.uploadImg(ev)
            if (newPhoto) {
                currPlaylist.imgUrl = newPhoto.url
                await playlistService.updatePlaylist(currPlaylist)
                loadPlaylist()
            }
        }
    }

    const onSetPlaylist = () => {
        console.log('playlist:', currPlaylist)
        if (currPlaylist) dispatch(setPlaylist(currPlaylist))
    }



    const onOpenModal = (ev: MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation()
        setIsPlaylistModalOpen(!isPlaylistModalOpen)
    }

    const onRemovePlaylist = async () => {
        if (playlistId) {
            try {
                await playlistService.removePlaylist(playlistId)
                navigate('/')
            } catch (err) {
                console.log('err:', err)
            }
        }
    }

    if (!currPlaylist) return <h1 style={{ color: 'white' }}>Loading...</h1>
    return (
        <section className="playlist-details" onClick={() => {closeModal();setIsPlaylistModalOpen(false)}}>
            <Helmet>
                <title>Slotify - {currPlaylist.name}</title>
            </Helmet>
            <header className="playlist-details-header flex">
                <div className="img-container">
                    <img src={currPlaylist.imgUrl} alt="" />
                    <div className="change-photo-btn">
                        <label htmlFor="changePhoto">
                            <div className="photo-label flex column align-center">
                                <span><FiEdit2 /></span>
                                <h3>Choose photo</h3>
                            </div>
                        </label>
                        <input type="file" id="changePhoto" onChange={onChangePhoto} hidden />
                    </div>
                </div>
                <div className="playlist-description flex column">
                    <h3>PLAYLIST</h3>
                    {/* <h1>{playlist.name}</h1> */}
                    <input className="playlist-title"
                        onBlur={onChangeTitle} defaultValue={currPlaylist.name}></input>
                    <h5>{currPlaylist?.createdBy?.fullName} • {currPlaylist?.songs?.length} songs</h5>
                </div>
            </header>
            <div className="playlist-details-main">
                <div className="playlist-details-main action-btns flex align-center">
                    <button className="play-btn" onClick={onSetPlaylist}><span><BsFillPlayCircleFill /></span></button>
                    <button className="menu-btn" onClick={onOpenModal}><span>• • •</span></button>
                    {isPlaylistModalOpen && <section style={{ left: '73px', top: '-10px' }} className="options-modal">
                        <button onClick={onRemovePlaylist}>Delete</button>
                    </section>}
                </div>
                <div className="playlist-details-main-content">
                    <div className="songs-titles-container">
                        <div className="songs-titles">
                            <div>#</div>
                            <div>title</div>
                            <div>date added</div>
                            <div><CiClock2 /></div>
                        </div>
                    </div>
                    <div className="songs-container">
                        {currPlaylist?.songs?.map((s, idx) => {
                            return <SongPreview key={s.id} song={s} toggleModal={toggleModal} index={idx} type={'playlist-details'} />
                        })}
                    </div>
                </div>
            </div>
            {isModalOpen && <SongsModal closeModal={closeModal} song={songForModal} modalPos={modalPos} />}
        </section>
    )
}