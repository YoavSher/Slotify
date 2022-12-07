import { useEffect } from "react"
import { Helmet } from "react-helmet"
import { Outlet } from "react-router-dom"
import { RecentlyPlayedList } from "../cmps/recently-played-list"
import { playlistService } from "../services/playlist.service"
import { setPlaylists } from "../store/playlist/playlist.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import loading from '../assets/img/Spotify-Loading-Animation-4.gif'
import { utilService } from "../services/util.service"
import { PlaylistContainer } from "../cmps/playlist-perview-cmps/playlists-container"

export const Home = () => {

    const playlists = useAppSelector(state => state.playlist.playlists)
    const dispatch = useAppDispatch()
    useEffect(() => {
        loadPlayList()
    }, [])

    const loadPlayList = async () => {
        const playlists = await playlistService.query()
        if (playlists) dispatch(setPlaylists(playlists))
    }
    if (!playlists) return <div className="loading-anim"><img src={loading} alt="" /></div>
    return (
        <>
            <section className="home-page">
                <Helmet><title>Slotify</title></Helmet>
                <h2 className="greeting">Good {utilService.getCurrentPartOfTheDay()}</h2>
                {/* <RecentlyPlayedList playlists={playlists} /> */}
                <PlaylistContainer playlists={playlists}/>
                <div className="pusher"></div>
            </section>
            <Outlet></Outlet>
        </>

    )
}


