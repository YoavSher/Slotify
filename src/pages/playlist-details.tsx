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
import { useSongModal } from "../hooks/useSongModal"
import { songService } from "../services/songs.service"
import { useMusicPlayerMethods } from "../hooks/useMusicPlayerMethods"
import { RemoveFromPlaylistBtn } from "./remove-from-playlist"
import { SongsTableHead } from "../cmps/playlist-details-cmps/songs-table-head"
import { SongsTable } from "../cmps/playlist-details-cmps/songs-table"
import { LikeButtonPlaylist } from "../cmps/playlist-details-cmps/like-button-playlist"
import { ActionMsg } from "../cmps/action-msg"
import loading from '../assets/img/Spotify-Loading-Animation-4.gif'

export const PlaylistDetails = () => {
    const params = useParams()
    const playlistId = params.playlistId ? +params.playlistId : null
    const navigate = useNavigate()

    const playlists = useAppSelector(state => state.playlist.playlists)
    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const screenWidth = useAppSelector(state => state.helper.screenWidth)

    const [msg, setMsg] = useState('')
    const [currPlaylist, setCurrPlaylist] = useState<Playlist>()
    const [songs, setSongs] = useState<Song[]>([])
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false)
    const isMobile = screenWidth <= 770
    const isCurrentUserPlaylistOwner = loggedInUser?._id === currPlaylist?.creatorId

    const { toggleModal, closeModal, isModalOpen, songForModal, modalPos } = useSongModal()

    useGetPlaylist(playlistId, playlists, setCurrPlaylist, setSongs)

    const {
        onAddPlaylistToQueue, playSongFromPlaylist,
        onClickPlay, isCurrPlaylistPlaying } = useMusicPlayerMethods(playlistId, songs, loggedInUser)

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
                showActionMsg('Song added to playlist')
            }
        } catch (err) {
            setSongs(prevState => {
                return prevState.filter(s => s.videoId !== song.videoId)
            })
            console.log(err)
        }
    }

    const removeSongFromPlaylist = async (song: Song) => {
        const { videoId } = song
        const idx = songs.findIndex(s => videoId === s.videoId)
        if (idx === -1) return
        try {
            if (playlistId) {
                setSongs(prevState => {
                    return prevState.filter(s => s.videoId !== song.videoId)
                })
                await songService.removeFromPlaylist({ playlistId, videoId, idx })
                showActionMsg('Song removed')
            }
        } catch (err) {
            setSongs(prevState => {

                prevState.splice(idx, 0, song)
                return [...prevState]
            })
            console.log(err)
        }
    }

    const showActionMsg = (txt: string) => {
        setMsg(txt)
        setTimeout(() => {
            setMsg('')
        }, 2000)
    }

    if (!currPlaylist) return <div className="loading-anim"><img src={loading} alt="" /></div>
    return (
        <section className="playlist-details" onScroll={closeModal} onClick={() => { closeModal(); setIsPlaylistModalOpen(false) }}>

            <Helmet>
                <title>Slotify - {currPlaylist.name}</title>
            </Helmet>
            <PlaylistDetailsHeader
                isCurrentUserPlaylistOwner={isCurrentUserPlaylistOwner}
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
                    {loggedInUser && !isCurrentUserPlaylistOwner && < LikeButtonPlaylist playlist={currPlaylist} />}
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
            {msg && <ActionMsg msg={msg} />}
            {isModalOpen && songForModal && <SongsModal
                closeModal={closeModal}
                song={songForModal}
                modalPos={modalPos}
                isMobile={isMobile}
                renderedChild={<RemoveFromPlaylistBtn isRendered={isCurrentUserPlaylistOwner}
                    song={songForModal} removeSongFromPlaylist={removeSongFromPlaylist} />}
            />}
            {isCurrentUserPlaylistOwner && <PlaylistDetailsSearch
                screenWidth={screenWidth}
                playlistId={currPlaylist._id}
                onAddToPlaylist={onAddToPlaylist} />}
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
        return (() => {
            setCurrPlaylist(undefined)
            setSongs([])
        })
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
