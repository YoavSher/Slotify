import { Song } from "../interfaces/song"
import { addToPlaylist, removeSong } from "../store/music-player/music-player.reducer"
import { useAppDispatch } from "../store/store.hooks"

interface Props {
    song: Song | null,
    closeModal: any,
    modalPos: { left: number, top: number }
}

export const SongsModal = ({ song, closeModal, modalPos }: Props) => {

    const dispatch = useAppDispatch()
    const addSongToQueue = () => {
        if (song) dispatch(addToPlaylist(song))
    }
    const removeSongFromQueue = () => {
        // if (index) dispatch(removeSong(index)) // we should work with specific ids.
    }

    const calcModalPos = () => {
        return {
            left: `${modalPos.left - 175}px`,
            top: `${modalPos.top - 10}px`
        } /// needs to add consideration for the height but the left is fixed,
    }

    return (
        <section style={calcModalPos()} className="options-modal">
            <button onClick={addSongToQueue}>Add to queue</button>
            <button onClick={removeSongFromQueue}>Remove from queue</button>
        </section>
    )
}