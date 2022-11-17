import { useAppSelector } from "../store/store.hooks"
import { Song } from "../interfaces/song"
import { FunctionBody } from "typescript"
import { playlistService } from "../services/playlist.service"

interface Props {
    song: Song | null,
    modalPos: { left: number, top: number },
    onOpenAddModal: Function
}

export const AddToPlaylistModal = ({ modalPos, song, onOpenAddModal }: Props) => {


    const playlists = useAppSelector(state => state.playlist.playlists)

    const calcModalPos = () => {
        return {
            left: `${modalPos.left - 360}px`,
            top: `${modalPos.top - 75}px`
        } /// needs to add consideration for the height but the left is fixed,
    }

    const onAddToPlaylist = async (playlistId: string | undefined) => {
        // console.log('playlistId:', playlistId)
        try {
            let playlist
            if (playlistId) {
                playlist = await playlistService.getPlaylistById(playlistId)
                // console.log('playlist:', playlist)
                playlist.songs.push(song)
                await playlistService.updatePlaylist(playlist)
                onOpenAddModal(false)
            }
        } catch (err) {
            console.log('err:', err)
        }

    }

    return (
        <section style={calcModalPos()} className="add-to-playlist-modal options-modal"
            onMouseOver={() => onOpenAddModal(true)} onMouseLeave={() => onOpenAddModal(false)}>
            <div>
                <input type="text" placeholder="Find a playlist" />
            </div>
            <div>
                {playlists?.map(p => <button key={p._id} onClick={() => onAddToPlaylist(p._id)}>{p.name}</button>)}
            </div>
        </section>
    )
}