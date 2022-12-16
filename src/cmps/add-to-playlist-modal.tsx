import { useAppSelector } from "../store/store.hooks"
import { Song } from "../interfaces/song"
import { FunctionBody } from "typescript"
import { playlistService } from "../services/playlist.service"
import { ChangeEvent, MouseEvent, useEffect, useState } from "react"
import { songService } from "../services/songs.service"

interface Props {
    song: Song | null,
    modalPos: { left: number, top: number },
    onOpenAddModal: Function,
    isMobile: boolean,
    toggleModalMobile: Function,
    height: number,
    showActionMsg: any
}

export const AddToPlaylistModal = ({ toggleModalMobile, modalPos, song, onOpenAddModal, isMobile, height, showActionMsg }: Props) => {



    //:TODO make an ajax call for the user's playlists or 
    // take from state.user.playlists and filter out only those that the creator id is the same

    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const playlists = useAppSelector(state => state.user.playlists)
    const playlistsToShow = playlists?.filter(p => p.creatorId === loggedInUser?._id)
    const [filteredPlaylists, setFilteredPlaylists] = useState(playlistsToShow)


    const calcModalPos = () => {
        if (isMobile) return { left: '0', top: '0', height }
        else return {
            left: `${modalPos.left - 363}px`,
            top: `${modalPos.top - 50}px`,
            height
        }
    }

    const onAddToPlaylist = async (playlistId: number | undefined, name: string | undefined) => {
        try {
            if (playlistId && song && name) {
                const songs = await songService.getPlaylistSongs(playlistId)
                const { videoId } = song
                if (songs !== undefined) {
                    if (songs.some((currSong: Song) => currSong.videoId === song?.videoId)) return
                    const newSong = { playlistId: playlistId, videoId, addedAt: Date.now(), idx: songs.length }
                    await songService.addSongToPlaylist(newSong)
                    showActionMsg(`Added to ${name}`)
                }
                if (isMobile) toggleModalMobile()
                else onOpenAddModal(false)
            }
        } catch (err) {
            showActionMsg(`Failed to add to ${name}`)
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
        <section style={calcModalPos()} className="add-to-playlist-modal options-modal add-to-modal"
            onMouseOver={() => onOpenAddModal(true)} onMouseLeave={() => onOpenAddModal(false)} >
            <div className="input-container">
                <input className="search-playlist-input" type="text" placeholder="Find a playlist"
                    onClick={onStopPropagation} onChange={onHandleChange} onFocus={() => onOpenAddModal(true)} />
            </div>
            <div className="playlists-container">
                <div>
                    {!isMobile ? filteredPlaylists?.map(p => <button key={p._id} onClick={() => onAddToPlaylist(p._id, p.name)}>{p.name}</button>)
                        : filteredPlaylists?.map(p => <article onClick={() => onAddToPlaylist(p._id, p.name)} className="mini-playlist">
                            <img src={p.image} alt="" />
                            <section className="texts">
                                <p>{p.name}</p>
                            </section>
                        </article>)}
                </div>
            </div>
        </section>
    )
}
