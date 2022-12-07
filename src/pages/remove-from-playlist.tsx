import { Song } from "../interfaces/song"

interface Props {
    removeSongFromPlaylist: (song: Song) => void,
    song: Song,
    isRendered: boolean
}
export const RemoveFromPlaylistBtn = ({ song, removeSongFromPlaylist, isRendered }: Props) => {
    if (!isRendered) return <></>
    return (
        <button onClick={() => removeSongFromPlaylist(song)}>Remove from Playlist</button>
    )
}