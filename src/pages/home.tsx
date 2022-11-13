import { Outlet } from "react-router-dom"
import { PlaylistList } from "../cmps/playlist-list"
import { useAppSelector } from "../store/store.hooks"


export const Home = () => {

    const playlists = useAppSelector(state => state.playlist.playlists)
    if (!playlists) return <h1>Loading...</h1>
    return (
        <section className="home-page">
            <h1>home</h1>
            <PlaylistList playlists={playlists} />
            <Outlet></Outlet>
        </section>

    )
}