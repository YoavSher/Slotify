import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from 'react-helmet'

import { BsFillPlayCircleFill } from 'react-icons/bs'
import { CiClock2 } from 'react-icons/ci'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'

import { Playlist } from "../interfaces/playlist"
import { playlistService } from "../services/playlist.service"

export const PlaylistDetails = () => {

    const params = useParams()
    const { playlistId } = params
    const [playlist, setPlaylist] = useState<Playlist>()
    useEffect(() => {
        loadPlaylist()
        console.log('playlist:', playlist?.createdBy.fullName)
    }, [])

    const loadPlaylist = async () => {
        if (playlistId) {
            try {
                const playlist = await playlistService.getPlaylistById(playlistId)

                setPlaylist(playlist)

            } catch (err) {
                console.log('err:', err)
            }
        }
    }
    if (!playlist) return <h1 style={{ color: 'white' }}>Loading...</h1>
    return (
        <section className="playlist-details">
            <Helmet>
                <title>Slotify - {playlist.name}</title>
            </Helmet>
            <header className="playlist-details-header flex">
                <div className="img-container">
                    <img src={playlist.imgUrl} alt="" />
                </div>
                <div className="playlist-description flex column">
                    <h3>PLAYLIST</h3>
                    <h1>{playlist.name}</h1>
                    <h5>{playlist?.createdBy?.fullName} • {playlist?.songs?.length} songs</h5>
                </div>
            </header>
            <div className="playlist-details-main">
                <div className="playlist-details-main action-btns flex align-center">
                    <button className="play-btn"><span><BsFillPlayCircleFill /></span></button>
                    <button className="menu-btn"><span>• • •</span></button>
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
                        {playlist?.songs?.map((s, idx) => {
                            return <div key={s.id}>
                                {s.title}
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}