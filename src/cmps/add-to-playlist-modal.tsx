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
    toggleModalMobile: Function
}

export const AddToPlaylistModal = ({ toggleModalMobile, modalPos, song, onOpenAddModal, isMobile }: Props) => {

    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const playlists = useAppSelector(state => state.playlist.playlists)
    const playlistsToShow = playlists?.filter(p => p.creatorId === loggedInUser?._id)
    const [filteredPlaylists, setFilteredPlaylists] = useState(playlistsToShow)


    const calcModalPos = () => {
        if (isMobile) return { left: '0', top: '0' }
        else return {
            left: `${modalPos.left - 363}px`,
            top: `${modalPos.top - 100}px`
        }
    }

    const onAddToPlaylist = async (playlistId: number | undefined) => {
        try {
            if (playlistId && song) {
                const songs = await songService.getPlaylistSongs(playlistId)
                // const playlist = await playlistService.getPlaylistById(playlistId)

                // const s = { ...song, addedAt: Date.now() }
                // playlist.songs.push(s)
                // await playlistService.updatePlaylist(playlist)
                const { videoId } = song
                if (songs !== undefined) {
                    if (songs.some((currSong: Song) => currSong.videoId === song?.videoId)) return
                    // if (songs.some(s => s.videoId === videoId)) return
                    const newSong = { playlistId: playlistId, videoId, addedAt: Date.now(), idx: songs.length }
                    await songService.addSongToPlaylist(newSong)

                }
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
                        <img src={p.image} alt="" />
                        <section className="texts">
                            <p>{p.name}</p>
                            {/* <p>{p.createdBy.fullName}</p> */}
                        </section>
                    </article>)}
            </div>
        </section>
    )
}


// ( '1w7OgIMMRc4', 'Guns N Roses - Sweet Child O Mine',  'GunsNRoses',  'https://i.ytimg.com/vi/1w7OgIMMRc4/hqdefault.jpg',  303000)
// ( '8SbUC-UaAxE', 'Guns N Roses - November Rain',  'GunsNRoses',  'https://i.ytimg.com/vi/8SbUC-UaAxE/hqdefault.jpg',  557000)
// ( 'Rbm6GXllBiw', 'Guns N Roses - Paradise City',  'GunsNRoses',  'https://i.ytimg.com/vi/Rbm6GXllBiw/hqdefault.jpg',  409000)