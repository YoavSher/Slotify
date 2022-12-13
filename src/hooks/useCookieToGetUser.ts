import { useAppDispatch } from "../store/store.hooks"
import { useEffect } from 'react'
import { setLikedPlaylists, setLikedSongs, setRecentPlaylists, setUser } from "../store/user/user.reducer"
import { songService } from "../services/songs.service"
import { userService } from "../services/user.service"
import { Song } from "../interfaces/song"
import { playlistService } from "../services/playlist.service"
import { Playlist } from "../interfaces/playlist"

export const useCookieToGetUser = () => {
    const dispatch = useAppDispatch()
    const checkCookie = async () => {
        if (document.cookie.includes('loginToken')) {
            const user = await userService.checkLoginToken()
            if (user) {
                dispatch(setUser(user))
                const songs = await songService.getLikedSongs(user._id) as Song[]
                dispatch(setLikedSongs(songs))
                const playlists = await playlistService.getUserPlaylists(user._id) as Playlist[]
                dispatch(setLikedPlaylists(playlists))
                const recentlyPlayed = await playlistService.getUserRecentPlaylists(user._id) as Playlist[]
                dispatch(setRecentPlaylists(recentlyPlayed))
            }
        }
    }

    useEffect(() => {
        checkCookie()
    }, [])
}