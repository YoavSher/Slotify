import { ChangeEvent, FocusEvent, MouseEvent, MouseEventHandler, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Helmet } from 'react-helmet'

import { BsFillPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs'
import { FaPauseCircle } from 'react-icons/fa'
import { BiShuffle } from 'react-icons/bi'


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
import { Loader } from "../cmps/loader"
import { useIsMobile } from "../hooks/useIsMobile"
import { onPlaylistDislike, updateUserPlaylist } from "../store/user/user.reducer"
import { useShowActionMsg } from "../hooks/useShowActionMsg"
import { useSongsShuffle } from "../hooks/useSongsShuffle"
import { utilService } from "../services/util.service"

export const PlaylistDetails = () => {
    const params = useParams()
    const dispatch = useAppDispatch()
    const playlistId = params.playlistId ? +params.playlistId : null
    const navigate = useNavigate()

    const playlists = useAppSelector(state => state.playlist.playlists)
    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const currPlayingIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const queueSongs = useAppSelector(state => state.musicPlayer.songs)
    const { isMobile, screenWidth } = useIsMobile()


    const [currPlaylist, setCurrPlaylist] = useState<Playlist>()
    const [songs, setSongs] = useState<Song[]>([])
    const [songsDuration, setSongsDuration] = useState('')
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false)
    const isCurrentUserPlaylistOwner = loggedInUser?._id === currPlaylist?.creatorId

    const { toggleModal, closeModal, isModalOpen, songForModal, modalPos } = useSongModal()
    const { isShuffled, toggleSongsShuffle } = useSongsShuffle(queueSongs, currPlayingIdx)

    useGetPlaylist(playlistId, playlists, setCurrPlaylist, setSongs, setSongsDuration)
    const { msg, showActionMsg } = useShowActionMsg()
    const {
        onAddPlaylistToQueue, playSongFromPlaylist,
        onClickPlay, isCurrPlaylistPlaying } = useMusicPlayerMethods(currPlaylist, songs, loggedInUser)

    const handleOnDragEnd = async (result: any) => {
        if (!isCurrentUserPlaylistOwner) return
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
        if (!isCurrentUserPlaylistOwner) return
        let { value } = ev.target
        if (currPlaylist) {
            setCurrPlaylist((prevState) => {
                if (prevState) {
                    return { ...prevState, name: value }
                }
            })
        }
    }

    const onSaveChanges = async (newPlaylist = currPlaylist) => {
        if (!isCurrentUserPlaylistOwner) return
        try {
            if (newPlaylist) {
                dispatch(updateUserPlaylist(newPlaylist))
                await playlistService.updatePlaylist(newPlaylist)
            }

        } catch (err) {
            console.log('err:', err)
        }
    }

    const onChangePhoto = async (ev: ChangeEvent<HTMLInputElement>) => {
        if (!isCurrentUserPlaylistOwner) return
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
        if (!isCurrentUserPlaylistOwner) return
        if (playlistId) {
            try {
                dispatch(onPlaylistDislike(playlistId))
                navigate('/')
                await playlistService.removePlaylist(playlistId)
            } catch (err) {
                console.log('err:', err)
            }
        }
    }

    const onAddToPlaylist = async (song: Song) => {
        if (!isCurrentUserPlaylistOwner) return
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
        if (!isCurrentUserPlaylistOwner) return
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



    if (!currPlaylist) return <Loader />
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
                songsDuration={songsDuration}
                isMobile={isMobile} />
            <div className="playlist-details-main">
                <div className="playlist-details-main action-btns flex align-center">
                    <div className="start-btns">
                        <button className="play-btn" onClick={onClickPlay}>
                            <span>{isCurrPlaylistPlaying ? <FaPauseCircle /> : <BsFillPlayCircleFill />}</span>
                        </button>
                        {isMobile && <button className={`shuffle-btn ${(isShuffled) ? 'shuffled' : ''}`}
                            onClick={toggleSongsShuffle}>
                            <span ><BiShuffle /></span>
                        </button>}
                    </div>
                    <div className="end-btns">
                        {loggedInUser && !isCurrentUserPlaylistOwner && < LikeButtonPlaylist playlist={currPlaylist} />}
                        <button className="menu-btn" onClick={onTogglePlaylistModal}><span>• • •</span></button>
                        {isPlaylistModalOpen && <section style={{ position: 'absolute', left: '95px', top: '33px' }} className="playlist-modal options-modal">
                            {isCurrentUserPlaylistOwner &&
                                <button onClick={onRemovePlaylist}>Delete</button>}
                            <button onClick={onAddPlaylistToQueue}>Add to queue</button>
                        </section>}
                    </div>
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
                showActionMsg={showActionMsg}
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
    setSongs: React.Dispatch<React.SetStateAction<Song[]>>,
    setSongsDuration: React.Dispatch<React.SetStateAction<string>>) => {
    useEffect(() => {

        loadPlaylist()
        return (() => {
            setCurrPlaylist(undefined)
            setSongs([])
        })
    }, [playlistId])
    interface FullPlaylist {
        playlist: Playlist,
        songs: Song[]
    }
    const loadPlaylist = async () => {
        try {
            if (playlistId !== null) {
                const { playlist, songs }: FullPlaylist = await playlistService.getPlaylistById(playlistId)
                setCurrPlaylist(playlist)
                setSongs(songs)
                let duration = 0
                songs.forEach(s => duration += s.duration)
                const totalDuration = utilService.getTotalSongsDuration(duration)
                setSongsDuration(totalDuration)
            }
        } catch (err) {
            console.log('err:', err)
        }
    }

}
