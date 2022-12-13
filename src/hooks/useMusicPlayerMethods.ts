import { MiniUser } from "../interfaces/mini-user"
import { Playlist } from "../interfaces/playlist"
import { Song } from "../interfaces/song"
import { playlistService } from "../services/playlist.service"
import { User } from "../services/user.service"
import { addSongsToQueue, setIsSongPlaying, setPlayingIdx, setPlaylist } from "../store/music-player/music-player.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { onPlaylistPlay } from "../store/user/user.reducer"

export const useMusicPlayerMethods = (playlist: Playlist | undefined, songs: Song[], loggedInUser: MiniUser | null) => {
    // the playlist likedSongs has a playlistId of 0 //
    const playlistId = playlist?._id
    const dispatch = useAppDispatch()
    const queuePlaylistId = useAppSelector(state => state.musicPlayer.playlistId)
    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const isCurrPlaylistOnQueue = playlistId === queuePlaylistId
    const isCurrPlaylistPlaying = isCurrPlaylistOnQueue && isSongPlaying
    const onAddPlaylistToQueue = () => {
        if (songs) dispatch(addSongsToQueue(songs))
    }

    const onClickPlay = (ev: React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation()
        if (playlistId || playlistId === 0) {
            if (isCurrPlaylistPlaying) {
                dispatch(setIsSongPlaying(false))
            } else if (isCurrPlaylistOnQueue && !isSongPlaying) {
                dispatch(setIsSongPlaying(true))
            } else {
                dispatch(setPlaylist({ songs, playlistId }))
                if (loggedInUser && playlistId !== 0) {
                    try {
                        if (playlist) dispatch(onPlaylistPlay(playlist))
                        playlistService.addToRecentlyPlayed(playlistId)
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
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