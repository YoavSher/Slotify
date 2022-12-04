import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { FaPauseCircle } from 'react-icons/fa'
import { setIsSongPlaying, setPlaylist } from '../store/music-player/music-player.reducer'
import { useAppDispatch, useAppSelector } from '../store/store.hooks'
import { Playlist } from '../interfaces/playlist'
import { songService } from '../services/songs.service'

interface Props {
    playlistPre: Playlist
}


export const PlayListPreview = ({ playlistPre }: Props) => {

    const dispatch = useAppDispatch()
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const queueSongs = useAppSelector(state => state.musicPlayer.songs)
    const queuePlaylistId = useAppSelector(state => state.musicPlayer.playlistId)
    const currPlayingIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const isCurrPlaylistOnQueue = (playlistPre) ? playlistPre._id === queuePlaylistId : false
    const isMobile = screenWidth <= 770

    const onSetPlaylist = async () => {
        if (isCurrPlaylistOnQueue && isSongPlaying) {
            dispatch(setIsSongPlaying(false))
        } else if (isCurrPlaylistOnQueue && !isSongPlaying) {
            dispatch(setIsSongPlaying(true))
        } else {
            const songs = await loadSongs()
            if (songs && playlistPre._id) dispatch(setPlaylist({ songs, playlistId: playlistPre._id }))
        }
    }
    const loadSongs = async () => {
        if (playlistPre._id) {
            try {
                const songs = await songService.getPlaylistSongs(playlistPre._id)
                return songs
            } catch (err) {
                console.log('err:', err)
            }
        }
    }
    // change the booleans same style with the song preview 
    const isThisPlaylist = () => {
        if (isCurrPlaylistOnQueue && !isSongPlaying) return true
        return false
    }
    const isPlaylistPlaying = () => {
        if (isSongPlaying
            && isCurrPlaylistOnQueue) {
            // && playlistPre.songs.some(s => s.id === playlist?.songs[currPlayingIdx]?.id)) {
            return true
        }
        return false
    }


    return (
        <section className="playlist-preview">
            <div className="playlist-preview-container flex">
                <div className="img-container">
                    <img src={playlistPre.image} alt="" />
                </div>
                <div className='playlist-preview-content flex align-center justify-between'>
                    <div className='playlist-preview-content title'>
                        <h1><Link to={`playlist/${playlistPre._id}`}>{playlistPre.name}</Link></h1>
                    </div>
                    {!isMobile && !isPlaylistPlaying() && <div className='playlist-preview-content icon-container'>
                        <button onClick={onSetPlaylist}><span><BsFillPlayCircleFill /></span></button>
                    </div>}
                    {!isMobile && isPlaylistPlaying() && <div className='playlist-preview-content pause-container'>
                        <button onClick={onSetPlaylist}><span><FaPauseCircle /></span></button>
                    </div>}
                    {isMobile && isPlaylistPlaying() && <div>
                        <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt="" />
                    </div>}
                    {isMobile && isThisPlaylist() && <div>
                        <h1 style={{ color: 'green', fontSize: '1.5rem' }}>...</h1>
                    </div>}
                </div>
            </div>
        </section>
    )
}