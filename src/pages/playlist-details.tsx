import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Playlist } from "../interfaces/playlist"
import { playlistService } from "../services/playlist.service"

export const PlaylistDetails = () => {

    const params = useParams()
    const { playlistId } = params
    const [playlist, setPlaylist] = useState<Playlist>()
    useEffect(() => {
        loadPlaylist()
        console.log('playlist:', playlist)
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
    if (!playlist) return <h1 style={{color:'white'}}>Loading...</h1>
    return (
        <section className="playlist-details">
            <h1>{playlist.name}</h1>
        </section>
    )
}