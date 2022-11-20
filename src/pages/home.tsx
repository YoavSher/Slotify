import { useEffect } from "react"
import { Helmet } from "react-helmet"
import { Outlet } from "react-router-dom"
import { PlaylistList } from "../cmps/playlist-list"
import { playlistService } from "../services/playlist.service"
import { setPlaylists } from "../store/playlist/playlist.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"


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
    if (!playlists) return <h1>Loading...</h1>
    return (
        <>
            <section className="home-page">
                <Helmet><title>Slotify</title></Helmet>
                <h1>home</h1>
                <PlaylistList playlists={playlists} />
            </section>
            <Outlet></Outlet>
        </>

    )
}