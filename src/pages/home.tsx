import { useEffect } from "react"
import { Helmet } from "react-helmet"
import { Outlet } from "react-router-dom"
import { RecentlyPlayedList } from "../cmps/recently-played-list"
import { playlistService } from "../services/playlist.service"
import { setPlaylists } from "../store/playlist/playlist.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"

import { utilService } from "../services/util.service"
import { PlaylistContainer } from "../cmps/playlist-perview-cmps/playlists-container"
import { Loader } from "../cmps/loader"

export const Home = () => {

    const playlists = useAppSelector(state => state.playlist.playlists)
    const userRecentPlaylists = useAppSelector(state => state.user.recentPlaylists)
    const dispatch = useAppDispatch()
    useEffect(() => {
        loadPlayList()
    }, [])

    const loadPlayList = async () => {
        const playlists = await playlistService.query()
        if (playlists) dispatch(setPlaylists(playlists))
    }
    if (!playlists) return <Loader/>
    return (
        <>
            <section className="home-page">
                <Helmet><title>Slotify</title></Helmet>
                <h2 className="greeting">Good {utilService.getCurrentPartOfTheDay()}</h2>
                {userRecentPlaylists && <RecentlyPlayedList playlists={userRecentPlaylists} />}
                <PlaylistContainer playlists={playlists} />
                <div className="pusher"></div>
            </section>
            <Outlet></Outlet>
        </>

    )
}


