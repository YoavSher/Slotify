import { ChangeEvent, FocusEvent, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from 'react-helmet'

import { BsFillPlayCircleFill } from 'react-icons/bs'
import { FiEdit2 } from 'react-icons/fi'
import { CiClock2 } from 'react-icons/ci'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'

import { Playlist } from "../interfaces/playlist"
import { playlistService } from "../services/playlist.service"
import { uploadService } from "../services/upload.service"

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

    const onChangeTitle = async (ev: FocusEvent<HTMLInputElement>) => {
        const { value } = ev.target
        if (playlist) {
            playlist.name = value
            await playlistService.updatePlaylist(playlist)
            loadPlaylist()
        }
    }

    const onChangePhoto = async (ev: ChangeEvent<HTMLInputElement>) => {
        if (playlist) {
            const newPhoto = await uploadService.uploadImg(ev)
            if (newPhoto) {
                playlist.imgUrl = newPhoto.url
                await playlistService.updatePlaylist(playlist)
                loadPlaylist()
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
                    <div className="change-photo-btn">
                        <label htmlFor="changePhoto">
                            <div className="photo-label flex column align-center">
                                <span><FiEdit2 /></span>
                                <h3>Choose photo</h3>
                            </div>
                        </label>
                        <input type="file" id="changePhoto" onChange={onChangePhoto} hidden />
                    </div>
                </div>
                <div className="playlist-description flex column">
                    <h3>PLAYLIST</h3>
                    {/* <h1>{playlist.name}</h1> */}
                    <input className="playlist-title"
                        onBlur={onChangeTitle} defaultValue={playlist.name}></input>
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