import { Song } from "../interfaces/song"
import { SongPreview } from "./song-preview"

interface Props {
    songs: Song[]
    songIdx: number
}

export const SongsQueueList = ({ songs, songIdx }: Props) => {
    return (
        <>
            <section className="queue-song-list">
                {songs.map((song, index) => {
                    if (index < songIdx) return
                    else return <SongPreview index={index} type={'queue'} song={song} />
                })}
            </section>
        </>
    )
}