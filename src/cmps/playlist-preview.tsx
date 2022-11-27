import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { FaPauseCircle } from 'react-icons/fa'
import { setIsSongPlaying, setPlaylist } from '../store/music-player/music-player.reducer'
import { useAppDispatch, useAppSelector } from '../store/store.hooks'
import { Playlist } from '../interfaces/playlist'

interface Props {
    playlistPre: Playlist
}


export const PlayListPreview = ({ playlistPre }: Props) => {

    const dispatch = useAppDispatch()
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const playlist = useAppSelector(state => state.musicPlayer.currPlaylist)
    const currPlayingIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)

    const onSetPlaylist = () => {
        if (playlistPre._id === playlist._id && isSongPlaying) {
            dispatch(setIsSongPlaying(false))
        } else if (playlistPre._id === playlist._id && !isSongPlaying) {
            dispatch(setIsSongPlaying(true))
        } else dispatch(setPlaylist(playlistPre))
    }

    const isThisPlaylist = () => {
        if (playlistPre._id === playlist._id && !isSongPlaying) return true
        return false
    }
    const isPlaylistPlaying = () => {
        if (isSongPlaying
            && playlistPre._id === playlist._id) {
            // && playlistPre.songs.some(s => s.id === playlist?.songs[currPlayingIdx]?.id)) {
            return true
        }
        return false
    }

    return (
        <section className="playlist-preview">
            <div className="playlist-preview-container flex">
                <div className="img-container">
                    <img src={playlistPre.imgUrl} alt="" />
                </div>
                <div className='playlist-preview-content flex align-center justify-between'>
                    <div className='playlist-preview-content title'>
                        <h1><Link to={`playlist/${playlistPre._id}`}>{playlistPre.name}</Link></h1>
                    </div>
                    {screenWidth > 770 && !isPlaylistPlaying() && <div className='playlist-preview-content icon-container'>
                        <button onClick={onSetPlaylist}><span><BsFillPlayCircleFill /></span></button>
                    </div>}
                    {screenWidth > 770 && isPlaylistPlaying() && <div className='playlist-preview-content pause-container'>
                        <button onClick={onSetPlaylist}><span><FaPauseCircle /></span></button>
                    </div>}
                    {screenWidth < 770 && isPlaylistPlaying() && <div>
                        <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt="" />
                    </div>}
                    {screenWidth < 770 && isThisPlaylist() && <div>
                        <h1 style={{ color: 'green', fontSize: '1.5rem' }}>...</h1>
                    </div>}
                </div>
            </div>
        </section>
    )
}