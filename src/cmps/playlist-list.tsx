import { PlayListPreview } from "./playlist-preview"
import { Playlist } from '../interfaces/playlist'


export const PlaylistList = (props: any) => {
    const { playlists } = props
    return (
        <section className="playlist-list">
            {playlists.map((p:Playlist) => <PlayListPreview
                key={p._id} 
                playlist={p}/>)}
        </section>
    )
}