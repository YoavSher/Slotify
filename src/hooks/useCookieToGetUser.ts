import { useAppDispatch } from "../store/store.hooks"
import { useEffect } from 'react'
import { setLikedSongs, setUser } from "../store/user/user.reducer"
import { songService } from "../services/songs.service"
import { userService } from "../services/user.service"
import { Song } from "../interfaces/song"

export const useCookieToGetUser = () => {
    const dispatch = useAppDispatch()
    const checkCookie = async () => {
        if (document.cookie.includes('loginToken')) {
            const user = await userService.checkLoginToken()
            if (user) {
                dispatch(setUser(user))
                const songs = await songService.getLikedSongs(user._id) as Song[]
                dispatch(setLikedSongs(songs))
            }
        }
    }

    useEffect(() => {
        checkCookie()
    }, [])
}