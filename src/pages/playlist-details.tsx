import { ChangeEvent, FocusEvent, MouseEvent, MouseEventHandler, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Helmet } from 'react-helmet'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

import { BsFillPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs'
import { FaPauseCircle } from 'react-icons/fa'

import { CiClock2 } from 'react-icons/ci'

import { Playlist } from "../interfaces/playlist"
import { playlistService } from "../services/playlist.service"
import { uploadService } from "../services/upload.service"
import { SongPreview } from "../cmps/song-preview-cmps/song-preview"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { addSongsToQueue, setIsSongPlaying, setPlayingIdx, setPlaylist } from "../store/music-player/music-player.reducer"
import { SongsModal } from "../cmps/songs-modal"
import { Song } from "../interfaces/song"
import { PlaylistDetailsSearch } from "../cmps/playlist-details-cmps/playlist-details-search"
import { PlaylistDetailsHeader } from "../cmps/playlist-details-cmps/playlist-details-header"
import loading from '../assets/img/Spotify-Loading-Animation-4.gif'
import { useSongModal } from "../hooks/useSongModal"
import { songService } from "../services/songs.service"

export const PlaylistDetails = () => {
    const params = useParams()
    const playlistId = params.playlistId ? +params.playlistId : null
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const queuePlaylistId = useAppSelector(state => state.musicPlayer.playlistId)
    const playlists = useAppSelector(state => state.playlist.playlists)
    const screenWidth = useAppSelector(state => state.helper.screenWidth)

    const [currPlaylist, setCurrPlaylist] = useState<Playlist>()
    const [songs, setSongs] = useState<Song[]>([])
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false)

    const { toggleModal, closeModal, isModalOpen, songForModal, modalPos } = useSongModal()

    useGetPlaylist(playlistId, playlists, setCurrPlaylist, setSongs)

    const isCurrPlaylistOnQueue = (currPlaylist) ? currPlaylist._id === queuePlaylistId : false
    const isMobile = screenWidth <= 770




    const onAddPlaylistToQueue = () => {
        if (songs) dispatch(addSongsToQueue(songs))
    }
    

    const handleOnDragEnd = async (result: any) => {
        if (playlistId) {
            try {
                const updatedSongs = [...songs]
                // const [reorderedItem] = playlist.songs.splice(result.source.index, 1)
                const sourceIdx = result.source.index
                const destinationIdx = result.destination.index
                const [reorderedItem] = updatedSongs.splice(sourceIdx, 1)
                console.log('reorderedItem:', reorderedItem)
                const { videoId } = reorderedItem
                // playlist.songs.splice(result.destination.index, 0, reorderedItem)
                updatedSongs.splice(destinationIdx, 0, reorderedItem)
                await playlistService.reIndexPlaylistSongs({ playlistId, videoId, sourceIdx, destinationIdx })
                setSongs(updatedSongs)
            } catch (err) {
                console.log('err:', err)
            }
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
        try {
            const newPhoto = await uploadService.uploadImg(ev)
            if (currPlaylist) {
                if (newPhoto) {
                    setCurrPlaylist(prevState => {
                        if (prevState) {
                            return { ...prevState, image: newPhoto.url }
                        }
                    })
                    onSaveChanges({ ...currPlaylist, image: newPhoto.url })
                }
            }
        } catch (err) {
            console.log('err:', err)
        }
    }

    const isPlaylistPlaying = () => {
        if (queuePlaylistId) {
            if (isCurrPlaylistOnQueue && isSongPlaying) return true
            else if (isCurrPlaylistOnQueue && !isSongPlaying) return false
        }
        return false
    }

    const onSetPlaylist = () => {
        if (currPlaylist && playlistId) {
            if (isCurrPlaylistOnQueue && isSongPlaying) {
                dispatch(setIsSongPlaying(false))
            } else if (isCurrPlaylistOnQueue && !isSongPlaying) {
                dispatch(setIsSongPlaying(true))
            } else dispatch(setPlaylist({ songs, playlistId }))
        }
    }

    const playSongFromPlaylist = (index: number) => {
        if (currPlaylist && playlistId) {
            dispatch(setPlaylist({ songs, playlistId }))
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

        const { videoId } = song
        if (songs !== undefined && playlistId) {
            if (songs.some(s => s.videoId === videoId)) return
            const newSong = { playlistId: playlistId, videoId, addedAt: Date.now(), idx: songs.length }
            setSongs(prevState => {
                return [...prevState, { ...song, addedAt: Date.now() }]
            })
            songService.addSongToPlaylist(newSong)
        }
    }

    const removeSongFromPlaylist = (song: Song) => {
        // console.log('songId:', songId)
        const { videoId, idx } = song
        if (playlistId) {
            setSongs(prevState => {
                return prevState.filter(s => s.videoId !== song.videoId)
            })
            if (idx !== undefined) songService.removeFromPlaylist({ playlistId, videoId, idx })
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
                songsLength={songs.length}
                onChangePhoto={onChangePhoto}
                onChangeTitle={onChangeTitle}
                onSaveChanges={onSaveChanges}
                isMobile={isMobile} />
            <div className="playlist-details-main">
                <div className="playlist-details-main action-btns flex align-center">
                    <button className="play-btn" onClick={onSetPlaylist}>
                        <span>{isPlaylistPlaying() ? <FaPauseCircle /> : <BsFillPlayCircleFill />}</span></button>
                    <button className="menu-btn" onClick={onOpenModal}><span>• • •</span></button>
                    {isPlaylistModalOpen && <section style={{ position: 'absolute', left: '95px', top: '33px' }} className="playlist-modal options-modal">
                        <button onClick={onRemovePlaylist}>Delete</button>
                        <button onClick={onAddPlaylistToQueue}>Add to queue</button>
                    </section>}
                </div>
                <div className="playlist-details-main-content">
                    {songs.length > 0 && <div className="songs-titles-container">
                        {!isMobile && <div className="songs-titles">
                            <div className="hash">#</div>
                            <div className="title">TITLE</div>
                            <div className="date">DATE ADDED</div>
                            <div className="clock"><CiClock2 /></div>
                        </div>}
                    </div>}
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="playlist-songs">

                            {(provided) => (<div {...provided.droppableProps} ref={provided.innerRef} className="songs-container">
                                {songs?.map((s, idx) => {
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
            {isModalOpen && songForModal && <SongsModal
                closeModal={closeModal}
                song={songForModal}
                modalPos={modalPos}
                isMobile={isMobile}
                removeSongFromPlaylist={removeSongFromPlaylist} />}
            <PlaylistDetailsSearch screenWidth={screenWidth} playlistId={currPlaylist._id} onAddToPlaylist={onAddToPlaylist} />
            <div className="pusher"></div>
        </section>
    )
}


const useGetPlaylist = (playlistId: number | null, playlists: Playlist[] | null,
    setCurrPlaylist: React.Dispatch<React.SetStateAction<Playlist | undefined>>,
    setSongs: React.Dispatch<React.SetStateAction<Song[]>>) => {
    useEffect(() => {
        loadSongs()
        loadPlaylist()
    }, [playlistId, playlists])

    const loadPlaylist = () => {
        if (playlistId !== undefined && playlists) {
            const playlist = playlists.find((p: Playlist) => p._id === playlistId)
            setCurrPlaylist(playlist)
        }
    }
    const loadSongs = async () => {
        if (playlistId) {
            try {
                const songs = await songService.getPlaylistSongs(playlistId)
                if (songs) setSongs(songs)
            } catch (err) {
                console.log('err:', err)
            }
        }
    }
}