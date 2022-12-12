import { Playlist } from "../../interfaces/playlist"
import { PlaylistsList } from "./playlists-list"

interface Props {
    playlists: Playlist[]
}

export const PlaylistContainer = ({ playlists }: Props) => {
    const rockPlaylists = [...playlists].slice(0, 7)
    const rapPlaylists = [...playlists].slice(7, 13)
    const popPlaylists = [...playlists].slice(13,18)
    const IsraeliRockPlaylists = [...playlists].slice(18)
    return (
        <section className="playlist-container">
            <PlaylistsList topic={'Rock'} playlists={rockPlaylists} />
            <PlaylistsList topic={'Rap'} playlists={rapPlaylists} />
            <PlaylistsList topic={'Pop'} playlists={popPlaylists} />
            <PlaylistsList topic={' ישראלי'} playlists={IsraeliRockPlaylists} />
        </section>
    )
}