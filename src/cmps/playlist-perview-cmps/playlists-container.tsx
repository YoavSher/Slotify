import { Playlist } from "../../interfaces/playlist"
import { PlaylistsList } from "./playlists-list"

interface Props {
    playlists: Playlist[]
}

export const PlaylistContainer = ({ playlists }: Props) => {
    const rockPlaylists = [...playlists].splice(0, 7)
    const rapPlaylists = [...playlists].splice(7, 12)
    const popPlaylists = [...playlists].splice(13)
    return (
        <section className="playlist-container">
            <PlaylistsList topic={'Rock'} playlists={rockPlaylists} />
            <PlaylistsList topic={'Rap'} playlists={rapPlaylists} />
            <PlaylistsList topic={'Pop'} playlists={popPlaylists} />
        </section>
    )
}