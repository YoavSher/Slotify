import { Song } from "../interfaces/song"
import { songService } from "../services/songs.service"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { onSongDislike, onSongLike, setLikedSongs } from "../store/user/user.reducer"

export const useSongLikingSystem = (song: Song) => {
    const likedSongs = useAppSelector(state => state.user.likedSongs)

    const dispatch = useAppDispatch()
    const currSongId = song.videoId
    const isSongLiked = likedSongs?.some(s => s.videoId === currSongId)
    const toggleSongLike = async (ev: React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation()
        if (likedSongs) {
            try {

                if (isSongLiked) {
                    dispatch(onSongDislike(currSongId))
                    await songService.removeLikedSong(currSongId)
                } else {
                    const currSong = { ...song, addedAt: Date.now() }
                    dispatch(onSongLike(currSong))
                    await songService.addLikedSong(currSongId)
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    return { isSongLiked, toggleSongLike }
}