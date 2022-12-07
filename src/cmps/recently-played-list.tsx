import { RecentlyPlayedPreview } from "./recently-played-preview"
import { Playlist } from '../interfaces/playlist'


export const RecentlyPlayedList = (props: any) => {
    const { playlists } = props
    return (
        <section className="recently-played-list">
            {playlists.map((p:Playlist) => <RecentlyPlayedPreview
                key={p._id} 
                playlistPre={p}/>)}
        </section>
    )
}