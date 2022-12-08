import { Song } from "../interfaces/song"
import { addSongsToQueue, setIsSongPlaying, setPlayingIdx, setPlaylist } from "../store/music-player/music-player.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"

export const useMusicPlayerMethods = (playlistId: number | null, songs: Song[]) => {
    // the playlist likedSongs has a playlistId of 0 //
    const dispatch = useAppDispatch()
    const queuePlaylistId = useAppSelector(state => state.musicPlayer.playlistId)
    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const isCurrPlaylistOnQueue = playlistId === queuePlaylistId
    const isCurrPlaylistPlaying = isCurrPlaylistOnQueue && isSongPlaying
    const onAddPlaylistToQueue = () => {
        if (songs) dispatch(addSongsToQueue(songs))
    }

    const onClickPlay = (ev:React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation()
        if (playlistId || playlistId === 0) {
            if (isCurrPlaylistPlaying) {
                dispatch(setIsSongPlaying(false))
            } else if (isCurrPlaylistOnQueue && !isSongPlaying) {
                dispatch(setIsSongPlaying(true))
            } else dispatch(setPlaylist({ songs, playlistId }))
        }
    }

    const playSongFromPlaylist = (index: number) => {
        if (playlistId || playlistId === 0) {
            dispatch(setPlaylist({ songs, playlistId }))
            dispatch(setPlayingIdx(index))
        }
    }
    return { playSongFromPlaylist, onClickPlay, onAddPlaylistToQueue, isCurrPlaylistPlaying }

}