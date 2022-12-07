import { Playlist } from "../../interfaces/playlist"
import { PlaylistPreview } from "./playlist-preview"


interface Props {
    topic: string,
    playlists: Playlist[]
}

export const PlaylistsList = ({ topic, playlists }: Props) => {
    return (
        <section className="playlists-list">
            <h1>{topic}</h1>
            <section className="playlist-preview-container ">
                {playlists.map(p => <PlaylistPreview key={p._id} playlistPre={p} />)}
            </section>
        </section>
    )
}