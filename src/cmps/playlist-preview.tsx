import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { setPlaylist } from '../store/music-player/music-player.reducer'
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
        dispatch(setPlaylist(playlistPre))
    }

    const isPlaylistPlaying = () => {
        if (isSongPlaying
            && playlistPre.songs.some(s => s.id === playlist?.songs[currPlayingIdx]?.id)) {
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
                    {screenWidth > 770 && <div className='playlist-preview-content icon-container'>
                        <button onClick={onSetPlaylist}><span><BsFillPlayCircleFill /></span></button>
                    </div>}
                {screenWidth < 770 && isPlaylistPlaying() && <div>
                    <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt="" />
                </div>}
                </div>
            </div>
        </section>
    )
}