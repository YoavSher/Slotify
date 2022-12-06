import { NavLink } from "react-router-dom"
import { Playlist } from "../../interfaces/playlist"

interface Props {
    playlists: Playlist[]
}
export const PlaylistLinks = ({ playlists }: Props) => {
    return (
        <section className="playlists-links">
            <div className="playlists-links-container">
                <div className="scroll-container">
                    <ul>
                        <div>
                            {playlists?.map(p => {
                                return <li key={p._id}><NavLink to={`playlist/${p._id}`}>{p.name}</NavLink></li>
                            })}
                        </div>
                    </ul>
                </div>
            </div>
        </section>
    )
}