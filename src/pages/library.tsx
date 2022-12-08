import { LikedSongsPreview } from "../cmps/playlist-perview-cmps/liked-songs-preview"
import { PlaylistPreview } from "../cmps/playlist-perview-cmps/playlist-preview"
import { useCheckLoggedInUser } from "../hooks/useCheckLoggedInUser"
import { useAppSelector } from "../store/store.hooks"

export const Library = () => {
    useCheckLoggedInUser()
    const playlists = useAppSelector(state => state.user.playlists)

    return (
        <section className="library">
            <h1>Playlists</h1>
            <section className="library-playlist-container">
                <LikedSongsPreview />
                {playlists?.map(p => <PlaylistPreview key={p._id} playlistPre={p} />)}
            </section>
        </section>
    )
}