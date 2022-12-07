import { MouseEvent } from "react"
import { Playlist } from "../interfaces/playlist"
import { songService } from "../services/songs.service"
import { setIsSongPlaying, setPlaylist } from "../store/music-player/music-player.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"

export const usePlayPlaylistPreview = (playlistPre: Playlist) => {
    const dispatch = useAppDispatch()
    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const queuePlaylistId = useAppSelector(state => state.musicPlayer.playlistId)
    const isCurrPlaylistOnQueue = (playlistPre) ? playlistPre._id === queuePlaylistId : false

    const onSetPlaylist = async (ev:MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation()
        if (isCurrPlaylistOnQueue && isSongPlaying) {
            dispatch(setIsSongPlaying(false))
        } else if (isCurrPlaylistOnQueue && !isSongPlaying) {
            dispatch(setIsSongPlaying(true))
        } else {
            const songs = await loadSongs()
            if (songs && playlistPre._id) dispatch(setPlaylist({ songs, playlistId: playlistPre._id }))
        }
    }

    const loadSongs = async () => {
        if (playlistPre._id) {
            try {
                const songs = await songService.getPlaylistSongs(playlistPre._id)
                return songs
            } catch (err) {
                console.log('err:', err)
            }
        }
    }
    // change the booleans same style with the song preview 
    const isThisPlaylist = () => {
        if (isCurrPlaylistOnQueue && !isSongPlaying) return true
        return false
    }

    const isPlaylistPlaying = () => {
        if (isSongPlaying
            && isCurrPlaylistOnQueue) {
            // && playlistPre.songs.some(s => s.id === playlist?.songs[currPlayingIdx]?.id)) {
            return true
        }
        return false
    }
    return { onSetPlaylist, isThisPlaylist, isPlaylistPlaying }
}