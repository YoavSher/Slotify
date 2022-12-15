import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import { PlaylistPreview } from "../cmps/playlist-perview-cmps/playlist-preview"
import { Playlist } from "../interfaces/playlist"
import { playlistService } from "../services/playlist.service"

export const Genre = () => {
    const { genrePlaylists, genre } = useGetGenrePlaylists()
    return (
        <section className="genre-page">
             <Helmet><title>Slotify - {genre}</title></Helmet>
            <h1>{genre}</h1>
            <div className="playlists-container">
                {genrePlaylists.map(p => <PlaylistPreview key={p._id} playlistPre={p} />)}
            </div>
            <div className="pusher"></div>
        </section>
    )
}

const useGetGenrePlaylists = () => {
    const params = useParams()
    const { genre } = params
    const [genrePlaylists, setGenrePlaylists] = useState<Playlist[]>([])

    useEffect(() => {
        loadPlaylist()
        return()=>{
            setGenrePlaylists([])  
        }
    }, [])

    const loadPlaylist = async () => {
        if (genre)
            try {
                const playlists = await playlistService.getGenrePlaylists(genre)
                setGenrePlaylists(playlists)
            } catch (err) {
                console.log('err:', err)
            }
    }
    return { genrePlaylists, genre }
}