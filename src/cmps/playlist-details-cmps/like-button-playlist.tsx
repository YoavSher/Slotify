import { Playlist } from "../../interfaces/playlist"
import { playlistService } from "../../services/playlist.service"
import { useAppDispatch, useAppSelector } from "../../store/store.hooks"
import { onPlaylistDislike, onPlaylistLike } from "../../store/user/user.reducer"
import { HeartSvg } from "../../svgs/heart-svg"

interface Props {
    playlist: Playlist
}
export const LikeButtonPlaylist = ({ playlist }: Props) => {
    const playlists = useAppSelector(state => state.user.playlists)
    const { isPlaylistLiked, togglePlaylistLike } = usePlaylistLikingSystem(playlist)
    if (!playlists) return <></>
    return (<div className="like-song">
        <button className={`like-btn ${(isPlaylistLiked) ? 'liked' : 'unliked'}`} onClick={togglePlaylistLike}>
            <HeartSvg />
        </button>

    </div>)
}

const usePlaylistLikingSystem = (playlist: Playlist) => {
    const userPlaylists = useAppSelector(state => state.user.playlists)

    const dispatch = useAppDispatch()
    const currPlaylistId = playlist._id
    const isPlaylistLiked = userPlaylists?.some(p => p._id === currPlaylistId)
    const togglePlaylistLike = async (ev: React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation()
        if (userPlaylists) {
            try {
                if (isPlaylistLiked) {
                    dispatch(onPlaylistDislike(currPlaylistId))
                    await playlistService.removeLikedPlaylist(currPlaylistId)
                } else {
                    dispatch(onPlaylistLike(playlist))
                    await playlistService.addLikedPlaylist(currPlaylistId)
                }
            } catch (err) {
                console.log(err)
            }
        }
    }
    return { isPlaylistLiked, togglePlaylistLike }
}