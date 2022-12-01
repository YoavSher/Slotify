import { ChangeEvent, FocusEvent, MouseEvent, MouseEventHandler, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Helmet } from 'react-helmet'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

import { BsFillPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs'
import { FaPauseCircle } from 'react-icons/fa'

import { CiClock2 } from 'react-icons/ci'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'

import { Playlist } from "../interfaces/playlist"
import { playlistService } from "../services/playlist.service"
import { uploadService } from "../services/upload.service"
import { SongPreview } from "../cmps/song-preview"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { setIsSongPlaying, setPlayingIdx, setPlaylist } from "../store/music-player/music-player.reducer"
import { SongsModal } from "../cmps/songs-modal"
import { Song } from "../interfaces/song"
import { PlaylistDetailsSearch } from "../cmps/playlist-details-search"
import { PlaylistDetailsHeader } from "../cmps/playlist-details-header"
import loading from '../assets/img/Spotify-Loading-Animation-4.gif'

export const PlaylistDetails = () => {

    const params = useParams()
    const { playlistId } = params
    const navigate = useNavigate()

    const [currPlaylist, setCurrPlaylist] = useState<Playlist>()
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [songForModal, setSongForModal] = useState<Song | null>(null)
    const [modalPos, setModalPos] = useState<{ left: number, top: number }>({ left: 0, top: 0 })

    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const playlist = useAppSelector(state => state.musicPlayer.currPlaylist)
    const playlists = useAppSelector(state => state.playlist.playlists)
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const storeCurrPlaylist = useAppSelector(state => state.musicPlayer.currPlaylist)
    const dispatch = useAppDispatch()

    useEffect(() => {
        loadPlaylist()
    }, [playlistId])

    const loadPlaylist = async () => {
        if (playlistId) {
            try {
                if (playlists) {
                    const playlist = playlists.filter((p: Playlist) => p._id === playlistId)
                    setCurrPlaylist(playlist[0])
                }

            } catch (err) {
                console.log('err:', err)
            }
        }
    }

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
    const handleOnDragEnd = async (result: any) => {
        if (currPlaylist) {
            const playlist = structuredClone(currPlaylist)
            const [reorderedItem] = playlist.songs.splice(result.source.index, 1)
            playlist.songs.splice(result.destination.index, 0, reorderedItem)
            // if (storeCurrPlaylist?._id && currPlaylist._id === storeCurrPlaylist._id) {
            //     console.log('hehe')
            // }
            // dispatch(reorderSongsList(songs)) // if this playlist is playing!
            setCurrPlaylist(playlist)
            await playlistService.updatePlaylist(playlist)
        }
    }


    const onChangeTitle = async (ev: FocusEvent<HTMLInputElement>) => {
        const { value } = ev.target
        if (currPlaylist) {
            setCurrPlaylist((prevState) => {
                if (prevState !== undefined) {
                    return { ...prevState, name: value }
                }
            })
        }
    }

    const onSaveChanges = async (newPlaylist = currPlaylist) => {
        if (newPlaylist) {
            await playlistService.updatePlaylist(newPlaylist)
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

    const isPlaylistPlaying = () => {
        if (currPlaylist) {
            if (currPlaylist._id === playlist._id && isSongPlaying) return true
            else if (currPlaylist._id === playlist._id && !isSongPlaying) return false
        }
    }

    const onSetPlaylist = () => {
        if (currPlaylist) {
            if (currPlaylist._id === playlist._id && isSongPlaying) {
                dispatch(setIsSongPlaying(false))
            } else if (currPlaylist._id === playlist._id && !isSongPlaying) {
                dispatch(setIsSongPlaying(true))
            } else dispatch(setPlaylist(currPlaylist))
        }
    }

    const playSongFromPlaylist = (index: number) => {
        if (currPlaylist) {
            dispatch(setPlaylist(currPlaylist))
            dispatch(setPlayingIdx(index))
        }
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

    const onAddToPlaylist = (song: Song) => {
        if (currPlaylist) {
            if (currPlaylist?.songs.some(s => s.videoId === song.videoId)) return
            const newPlaylist = { ...currPlaylist, songs: [...currPlaylist.songs, song] }
            setCurrPlaylist((prevState) => {
                if (prevState !== undefined) {
                    return { ...prevState, songs: [...prevState.songs, { ...song, addedAt: Date.now() }] }
                }
            })
            onSaveChanges(newPlaylist)
        }
    }

    if (!currPlaylist) return <div className="loading-anim"><img src={loading} alt="" /></div>
    return (
        <section className="playlist-details" onScroll={closeModal} onClick={() => { closeModal(); setIsPlaylistModalOpen(false) }}>
            <Helmet>
                <title>Slotify - {currPlaylist.name}</title>
            </Helmet>
            <PlaylistDetailsHeader
                playlist={currPlaylist}
                onChangePhoto={onChangePhoto}
                onChangeTitle={onChangeTitle}
                onSaveChanges={onSaveChanges}
                screenWidth={screenWidth} />
            <div className="playlist-details-main">
                <div className="playlist-details-main action-btns flex align-center">
                    <button className="play-btn" onClick={onSetPlaylist}>
                        <span>{isPlaylistPlaying() ? <FaPauseCircle /> : <BsFillPlayCircleFill />}</span></button>
                    <button className="menu-btn" onClick={onOpenModal}><span>• • •</span></button>
                    {isPlaylistModalOpen && <section style={{ position: 'absolute', left: '95px', top: '33px' }} className="playlist-modal options-modal">
                        <button onClick={onRemovePlaylist}>Delete</button>
                    </section>}
                </div>
                <div className="playlist-details-main-content">
                    {currPlaylist.songs.length > 0 && <div className="songs-titles-container">
                        {screenWidth > 770 && <div className="songs-titles">
                            <div className="hash">#</div>
                            <div className="title">TITLE</div>
                            <div className="date">DATE ADDED</div>
                            <div className="clock"><CiClock2 /></div>
                        </div>}
                    </div>}
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="playlist-songs">

                            {(provided) => (<div {...provided.droppableProps} ref={provided.innerRef} className="songs-container">
                                {currPlaylist?.songs?.map((s, idx) => {
                                    return <Draggable key={`${s.videoId}${idx}`} draggableId={`${s.videoId}${idx}`} index={idx}>
                                        {(provided) => (
                                            <article {...provided.draggableProps}{...provided.dragHandleProps} ref={provided.innerRef}>
                                                <SongPreview
                                                    playSongFromPlaylist={playSongFromPlaylist}
                                                    song={s}
                                                    toggleModal={toggleModal}
                                                    index={idx}
                                                    type={'playlist-details'}
                                                    screenWidth={screenWidth} />
                                            </article>)}
                                    </Draggable>
                                })}
                                {provided.placeholder}
                            </div>)}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
            {isModalOpen && <SongsModal
                closeModal={closeModal}
                song={songForModal}
                modalPos={modalPos}
                screenWidth={screenWidth} />}
            <PlaylistDetailsSearch screenWidth={screenWidth} playlistId={currPlaylist._id} onAddToPlaylist={onAddToPlaylist} />
            <div className="pusher"></div>
        </section>
    )
}