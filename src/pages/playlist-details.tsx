import { ChangeEvent, FocusEvent, MouseEvent, MouseEventHandler, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Helmet } from 'react-helmet'

import { BsFillPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs'
import { FaPauseCircle } from 'react-icons/fa'


import { Playlist } from "../interfaces/playlist"
import { playlistService } from "../services/playlist.service"
import { uploadService } from "../services/upload.service"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { SongsModal } from "../cmps/songs-modal"
import { Song } from "../interfaces/song"
import { PlaylistDetailsSearch } from "../cmps/playlist-details-cmps/playlist-details-search"
import { PlaylistDetailsHeader } from "../cmps/playlist-details-cmps/playlist-details-header"
import loading from '../assets/img/Spotify-Loading-Animation-4.gif'
import { useSongModal } from "../hooks/useSongModal"
import { songService } from "../services/songs.service"
import { useMusicPlayerMethods } from "../hooks/useMusicPlayerMethods"
import { RemoveFromPlaylistBtn } from "./remove-from-playlist"
import { SongsTableHead } from "../cmps/playlist-details-cmps/songs-table-head"
import { SongsTable } from "../cmps/playlist-details-cmps/songs-table"
import { LikeButtonPlaylist } from "../cmps/playlist-details-cmps/like-button-playlist"

export const PlaylistDetails = () => {
    const params = useParams()
    const playlistId = params.playlistId ? +params.playlistId : null
    const navigate = useNavigate()

    const playlists = useAppSelector(state => state.playlist.playlists)
    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const screenWidth = useAppSelector(state => state.helper.screenWidth)

    const [currPlaylist, setCurrPlaylist] = useState<Playlist>()
    const [songs, setSongs] = useState<Song[]>([])
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false)
    const isMobile = screenWidth <= 770

    const { toggleModal, closeModal, isModalOpen, songForModal, modalPos } = useSongModal()

    useGetPlaylist(playlistId, playlists, setCurrPlaylist, setSongs)

    const {
        onAddPlaylistToQueue, playSongFromPlaylist,
        onClickPlay, isCurrPlaylistPlaying } = useMusicPlayerMethods(playlistId, songs)

    const handleOnDragEnd = async (result: any) => {
        if (playlistId) {
            try {
                const updatedSongs = [...songs]
                const sourceIdx = result.source.index
                const destinationIdx = result.destination.index
                const [reorderedItem] = updatedSongs.splice(sourceIdx, 1)
                const { videoId } = reorderedItem
                updatedSongs.splice(destinationIdx, 0, reorderedItem)
                setSongs(updatedSongs)
                await playlistService.reIndexPlaylistSongs({ playlistId, videoId, sourceIdx, destinationIdx })
            } catch (err) {
                console.log('err:', err)
            }
        }
    }


    const onChangeTitle = async (ev: FocusEvent<HTMLInputElement>) => {
        const { value } = ev.target
        if (currPlaylist) {
            setCurrPlaylist((prevState) => {
                if (prevState) {
                    return { ...prevState, name: value }
                }
            })
        }
    }

    const onSaveChanges = async (newPlaylist = currPlaylist) => {
        if (newPlaylist) {
            //should update users playlist on store (navbar)
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

    const onTogglePlaylistModal = (ev: MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation()
        setIsPlaylistModalOpen(prev => !prev)
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

    const onAddToPlaylist = async (song: Song) => {
        try {
            const { videoId } = song
            if (songs && playlistId) {
                if (songs.some(s => s.videoId === videoId)) return
                const newSong = { playlistId: playlistId, videoId, addedAt: Date.now(), idx: songs.length }
                setSongs(prevState => {
                    return [...prevState, { ...song, addedAt: Date.now() }]
                })
                await songService.addSongToPlaylist(newSong)
            }
        } catch (err) {
            setSongs(prevState => {
                return prevState.filter(s => s.videoId !== song.videoId)
            })
            console.log(err)
        }
    }
    // const blockerRef = useRef(false)
    // const blockFunction = () => {
    //     blockerRef.current = true
    //     setTimeout(() => {
    //         blockerRef.current = false
    //     }, 100)
    // }

    const removeSongFromPlaylist = async (song: Song) => {
        // blockFunction()
        console.log('trying to remove')
        try {
            const { videoId } = song
            if (playlistId) {
                const idx = songs.findIndex(s => videoId === s.videoId)
                if (idx === -1) return
                setSongs(prevState => {
                    return prevState.filter(s => s.videoId !== song.videoId)
                })
                console.log('starting to delete', Date.now())
                await songService.removeFromPlaylist({ playlistId, videoId, idx })
                console.log('deleted!', Date.now())
            }
        } catch (err) {
            console.log(err)
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
                    <button className="play-btn" onClick={onClickPlay}>
                        <span>{isCurrPlaylistPlaying ? <FaPauseCircle /> : <BsFillPlayCircleFill />}</span>
                    </button>
                    {loggedInUser && < LikeButtonPlaylist playlist={currPlaylist} />}
                    <button className="menu-btn" onClick={onTogglePlaylistModal}><span>• • •</span></button>
                    {isPlaylistModalOpen && <section style={{ position: 'absolute', left: '95px', top: '33px' }} className="playlist-modal options-modal">
                        <button onClick={onRemovePlaylist}>Delete</button>
                        <button onClick={onAddPlaylistToQueue}>Add to queue</button>
                    </section>}
                </div>

                <div className="playlist-details-main-content">

                    {songs.length > 0 && < SongsTableHead isMobile={isMobile} />}

                    <SongsTable songs={songs} screenWidth={screenWidth}
                        toggleModal={toggleModal} handleOnDragEnd={handleOnDragEnd}
                        playSongFromPlaylist={playSongFromPlaylist} />
                </div>
            </div>
            {isModalOpen && songForModal && <SongsModal
                closeModal={closeModal}
                song={songForModal}
                modalPos={modalPos}
                isMobile={isMobile}
                renderedChild={<RemoveFromPlaylistBtn
                    song={songForModal} removeSongFromPlaylist={removeSongFromPlaylist} />}
            />}
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
            // if(!playlist) // fetch it
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
