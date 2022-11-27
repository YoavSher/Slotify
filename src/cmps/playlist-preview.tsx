import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { setPlaylist } from '../store/music-player/music-player.reducer'
import { useAppDispatch } from '../store/store.hooks'
import { Playlist } from '../interfaces/playlist'

interface Props {
    playlist: Playlist
}


export const PlayListPreview = ({ playlist }: Props) => {

    const dispatch = useAppDispatch()
    
    const onSetPlaylist = () => {
        dispatch(setPlaylist(playlist))
    }

   

    return (
        <section className="playlist-preview">
            <div className="playlist-preview-container flex">
                <div className="img-container">
                    <img src={playlist.imgUrl} alt="" />
                </div>
                <div className='playlist-preview-content flex align-center justify-between'>
                    <div className='playlist-preview-content title'>
                        <h1><Link to={`playlist/${playlist._id}`}>{playlist.name}</Link></h1>
                    </div>
                    {/* {screenWidth>770 && <div className='playlist-preview-content icon-container'>
                        <button onClick={onSetPlaylist}><span><BsFillPlayCircleFill /></span></button>
                    </div>} */}
                </div>
            </div>
        </section>
    )
}