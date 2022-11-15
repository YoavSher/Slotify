import { SongsQueueList } from "../cmps/songs-queue-list"
import { useAppSelector } from "../store/store.hooks"

export const Queue = () => {
    const songs = useAppSelector(state => state.musicPlayer.currPlaylist.songs)
    const songIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    console.log(songs.slice(songIdx + 1))
    console.log(songs[songIdx])
    return (
        <section className="queue-page">
            <h3>Queue</h3>
            <p>curr index {songIdx}</p>
            {/* now pplaying */}
            <SongsQueueList songIdx={songIdx} songs={songs} />
        </section>
    )
}