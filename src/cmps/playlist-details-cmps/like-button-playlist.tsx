import { Playlist } from "../../interfaces/playlist"
import { useAppSelector } from "../../store/store.hooks"
import { HeartSvg } from "../../svgs/heart-svg"

interface Props {
    playlist: Playlist
}
export const LikeButtonPlaylist = ({ playlist }: Props) => {
    const isPlaylistLiked = false
    const playlists = useAppSelector(state => state.user.playlists)
    const togglePlaylistLike = () => {

    }
    return (<div className="like-song">
        <button className={`like-btn ${(isPlaylistLiked) ? 'liked' : 'unliked'}`} onClick={togglePlaylistLike}>
            <HeartSvg />
        </button>

    </div>)
}