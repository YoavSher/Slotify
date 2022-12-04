import { useAppSelector } from "../store/store.hooks"
import { Song } from "../interfaces/song"
import { FunctionBody } from "typescript"
import { playlistService } from "../services/playlist.service"
import { ChangeEvent, MouseEvent, useState } from "react"

interface Props {
    song: Song | null,
    modalPos: { left: number, top: number },
    onOpenAddModal: Function,
    isMobile: boolean,
    toggleModalMobile: Function
}

export const AddToPlaylistModal = ({ toggleModalMobile, modalPos, song, onOpenAddModal, isMobile }: Props) => {

    const playlists = useAppSelector(state => state.playlist.playlists)
    const [filteredPlaylists, setFilteredPlaylists] = useState(playlists)

    const calcModalPos = () => {
        if (isMobile) return { left: '0', top: '0' }
        else return {
            left: `${modalPos.left - 363}px`,
            top: `${modalPos.top - 155}px`
        }
    }

    const onAddToPlaylist = async (playlistId: string | undefined) => {
        try {
            if (playlistId) {
                const playlist = await playlistService.getPlaylistById(playlistId)
                if (playlist.songs.some((currSong: Song) => currSong.videoId === song?.videoId)) return
                const s = { ...song, addedAt: Date.now() }
                playlist.songs.push(s)
                await playlistService.updatePlaylist(playlist)
                if (isMobile) toggleModalMobile()
                else onOpenAddModal(false)
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
            <div className="input-container">
                <input className="search-playlist-input" type="text" placeholder="Find a playlist"
                    onClick={onStopPropagation} onChange={onHandleChange} onFocus={() => onOpenAddModal(true)} />
            </div>
            <div>
                {!isMobile ? filteredPlaylists?.map(p => <button key={p._id} onClick={() => onAddToPlaylist(p._id)}>{p.name}</button>)
                    : filteredPlaylists?.map(p => <article onClick={() => onAddToPlaylist(p._id)} className="mini-playlist">
                        <img src={p.imgUrl} alt="" />
                        <section className="texts">
                            <p>{p.name}</p>
                            <p>{p.createdBy.fullName}</p>
                        </section>
                    </article>)}
            </div>
        </section>
    )
}