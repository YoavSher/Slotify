import { useAppSelector } from "../store/store.hooks"
import { Song } from "../interfaces/song"
import { FunctionBody } from "typescript"
import { playlistService } from "../services/playlist.service"
import { ChangeEvent, MouseEvent, useState } from "react"

interface Props {
    song: Song | null,
    modalPos: { left: number, top: number },
    onOpenAddModal: Function,
    screenWidth?: number
}

export const AddToPlaylistModal = ({ modalPos, song, onOpenAddModal, screenWidth }: Props) => {


    const playlists = useAppSelector(state => state.playlist.playlists)
    const [filteredPlaylists, setFilteredPlaylists] = useState(playlists)

    const calcModalPos = () => {
        if (screenWidth !== undefined && screenWidth < 770) {
            return {
                left: `${modalPos.left - 200}px`,
                top: `${modalPos.top - 10}px`
            }
        }
        return {
            left: `${modalPos.left - 548}px`,
            top: `${modalPos.top - 75}px`
        }
    }

    const onAddToPlaylist = async (playlistId: string | undefined) => {
        try {
            // let playlist
            if (playlistId) {
                const playlist = await playlistService.getPlaylistById(playlistId)
                const s = { ...song, addedAt: Date.now() }
                if (playlist.songs.some((currSong: Song) => currSong.videoId === song?.videoId)) return
                playlist.songs.push(s)
                await playlistService.updatePlaylist(playlist)
                onOpenAddModal(false)
            }
        } catch (err) {
            console.log('err:', err)
        }

    }

    const onStopPropagation = (ev: MouseEvent<HTMLInputElement>) => {
        ev.stopPropagation()

    }

    const onHandleChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (playlists) {

            const { value } = ev.target
            const regex = new RegExp(value, 'i')
            const playlistsToShow = playlists?.filter(p => regex.test(p.name))
            setFilteredPlaylists(playlistsToShow)
        }
    }

    return (
        <section style={calcModalPos()} className="add-to-playlist-modal options-modal"
            onMouseOver={() => onOpenAddModal(true)} onMouseLeave={() => onOpenAddModal(false)}>
            <div>
                <input type="text" placeholder="Find a playlist"
                    onClick={onStopPropagation} onChange={onHandleChange} onFocus={() => onOpenAddModal(true)} />
            </div>
            <div>
                {filteredPlaylists?.map(p => <button key={p._id} onClick={() => onAddToPlaylist(p._id)}>{p.name}</button>)}
            </div>
        </section>
    )
}