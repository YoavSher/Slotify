import { useSongLikingSystem } from "../hooks/useSongLikingSystem"
import { Song } from "../interfaces/song"
import { songService } from "../services/songs.service"
import { userService } from "../services/user.service"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { setLikedSongs, setUser } from "../store/user/user.reducer"
import { HeartSvg } from "../svgs/heart-svg"
interface Props {
    song: Song
}
export const LikeButton = ({ song }: Props) => {
    const { toggleSongLike, isSongLiked } = useSongLikingSystem(song)
    const likedSongs = useAppSelector(state => state.user.likedSongs)


    if (!likedSongs) return <></>
    return (
        <div className="like-song">
            <button className={`like-btn ${(isSongLiked) ? 'liked' : 'unliked'}`} onClick={toggleSongLike}>
                <HeartSvg/>
            </button>

        </div>
    )
}

