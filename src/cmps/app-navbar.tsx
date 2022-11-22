import { useEffect } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { BsSpotify, BsPlusSquare } from 'react-icons/bs'
import { RiHome2Line, RiHeartFill, RiHome2Fill ,RiSearchFill} from 'react-icons/ri'
import { FiSearch } from 'react-icons/fi'
import { VscLibrary } from 'react-icons/vsc'
import { ImBooks } from 'react-icons/im'
import { playlistService } from "../services/playlist.service"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { setPlaylists } from "../store/playlist/playlist.reducer"


export const AppNavbar = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const playlists = useAppSelector(state => state.playlist.playlists)
    const dispatch = useAppDispatch()

    useEffect(() => {
        console.log('location:', location)
        loadPlayList()
    }, [location])

    const onCreateNewBoard = async () => {
        const newPlaylist = await playlistService.createPlaylist()
        navigate(`playlist/${newPlaylist._id}`)
    }
    const loadPlayList = async () => {
        const playlists = await playlistService.query()
        if (playlists) dispatch(setPlaylists(playlists))
    }

    return (
        <nav className="app-navbar flex column">
            <h1 className="main-logo flex"><span><BsSpotify /></span> Slotify</h1>
            <ul className="nav-links-main">
                <li><NavLink to="" className='flex align-center'>
                    {location.pathname !== '/' && <span><RiHome2Line /></span>}
                    {location.pathname === '/' && <span><RiHome2Fill /></span>}
                    <p>Home</p></NavLink></li>
                <li><NavLink to="search" className='flex align-center'>
                    {!location.pathname.includes('search') && <span><FiSearch /></span>}
                    {location.pathname.includes('search') &&<span><RiSearchFill /></span>}
                     <p>Search</p></NavLink></li>
                <li><NavLink to="" className=" flex align-center">
                    <span><VscLibrary /></span>
                    {/* <span><ImBooks /></span> */}
                    <p>Your Library</p></NavLink></li>
            </ul>
            <div className="nav-links-second">
                <div className="create-playlist flex align-center" onClick={onCreateNewBoard}>
                    <div><span>+</span></div><p>Create Playlist</p>
                </div>
                <div className="liked-songs flex">
                    <NavLink to='/liked-songs' className="flex align-center">
                        <div><span><RiHeartFill /></span></div><p>Liked Songs</p></NavLink>
                </div>
                <div className="bottom-border">
                    <hr />
                    <div className="separator"></div>
                </div>
                <div className="playlists-links">
                    <div className="playlists-links-container">
                        <div className="scroll-container">
                            <ul>
                                <div>
                                    {playlists?.map(p => {
                                        return <li key={p._id}><NavLink to={`playlist/${p._id}`}>{p.name}</NavLink></li>
                                    })}
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}