import { useEffect } from "react"
import { Helmet } from "react-helmet"
import { Outlet } from "react-router-dom"
import { PlaylistList } from "../cmps/playlist-list"
import { playlistService } from "../services/playlist.service"
import { setPlaylists } from "../store/playlist/playlist.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import loading from '../assets/img/Spotify-Loading-Animation-4.gif'

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
                <h1>home</h1>
                <PlaylistList playlists={playlists} />
            </section>
            <div className="pusher"></div>
            <Outlet></Outlet>
        </>

    )
}