import { Song } from "../interfaces/song"
import { songService } from "../services/songs.service"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { onSongDislike, onSongLike, setLikedSongs } from "../store/user/user.reducer"

export const useSongLikingSystem = (song: Song) => {
    const likedSongs = useAppSelector(state => state.user.likedSongs)

    const dispatch = useAppDispatch()
    const toggleSongLike = async (ev: React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation()
        if (likedSongs) {
            try {
                if (isSongLiked) {
                    await songService.removeLikedSong(song.videoId)
                    dispatch(onSongDislike(song.videoId))
                } else {
                    await songService.addLikedSong(song.videoId)
                    const currSong = { ...song, addedAt: Date.now() }
                    dispatch(onSongLike(currSong))
                }
            } catch (err) {
                console.log(err)
            }
        }
    }
    const isSongLiked = likedSongs?.some(s => s.videoId === song.videoId)
    return { isSongLiked, toggleSongLike }
}