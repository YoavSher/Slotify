import { NavLink } from "react-router-dom"
import { Playlist } from "../../interfaces/playlist"
import { useAppSelector } from "../../store/store.hooks"
import { HiOutlineSpeakerWave } from 'react-icons/hi2'

interface Props {
    playlists: Playlist[]
}
export const PlaylistLinks = ({ playlists }: Props) => {
    const queuePlaylistId = useAppSelector(state => state.musicPlayer.playlistId)
    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    // const isCurrPlaylistOnQueue = 0 === queuePlaylistId
    // const isCurrPlaylistPlaying = isCurrPlaylistOnQueue && isSongPlaying
    return (
        <section className="playlists-links">
            <div className="playlists-links-container">
                <div className="scroll-container">
                    <ul>
                        <div>
                            {playlists?.map(p => {
                                return <li key={p._id} className="flex justify-between">
                                    <NavLink to={`playlist/${p._id}`}>{p.name}</NavLink>
                                    {/* {isCurrPlaylistPlaying &&
                                        <span className="nav-bar-playing"><HiOutlineSpeakerWave /></span>} */}
                                </li>
                            })}
                        </div>
                    </ul>
                </div>
            </div>
        </section>
    )
}