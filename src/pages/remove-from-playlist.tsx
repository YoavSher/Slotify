import { Song } from "../interfaces/song"

interface Props {
    removeSongFromPlaylist: (song: Song) => void,
    song: Song
}
export const RemoveFromPlaylistBtn = ({ song, removeSongFromPlaylist }: Props) => {

    return (
        <button onClick={() => removeSongFromPlaylist(song)}>Remove from Playlist</button>
    )
}