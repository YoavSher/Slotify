import { useEffect, useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { BsSpotify, BsPlusSquare } from 'react-icons/bs'
import { RiHome2Line, RiHeartFill, RiHome2Fill, RiSearchFill } from 'react-icons/ri'
import { FiSearch } from 'react-icons/fi'
import { IoLibraryOutline, IoLibrary } from 'react-icons/io5'
import { TiThListOutline } from 'react-icons/ti'

import { playlistService } from "../services/playlist.service"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { setPlaylists } from "../store/playlist/playlist.reducer"


export const AppNavbar = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const playlists = useAppSelector(state => state.playlist.playlists)
    const dispatch = useAppDispatch()
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)

    useEffect(() => {
        // console.log('screenWidth:', screenWidth)
        // if (screenWidth < 770) console.log('smaller');
        loadPlayList()
        window.addEventListener('resize', setDimensions)
        return () => {
            window.removeEventListener('resize', setDimensions)
        }
    }, [location, screenWidth])

    const onCreateNewBoard = async () => {
        const newPlaylist = await playlistService.createPlaylist()
        navigate(`playlist/${newPlaylist._id}`)
    }
    const loadPlayList = async () => {
        const playlists = await playlistService.query()
        if (playlists) dispatch(setPlaylists(playlists))
    }
    const setDimensions = () => {
        setScreenWidth(window.innerWidth)
    }

    return (
        <nav className="app-navbar flex column">
            {screenWidth > 770 && <h1 className="main-logo flex"><span><BsSpotify /></span> Slotify</h1>}
            <ul className="nav-links-main">
                <li><NavLink to="" className='flex align-center'>
                    {location.pathname !== '/' && <span><RiHome2Line /></span>}
                    {location.pathname === '/' && <span><RiHome2Fill /></span>}
                    <p>Home</p></NavLink></li>
                <li><NavLink to="search" className='flex align-center'>
                    {!location.pathname.includes('search') && <span><FiSearch /></span>}
                    {location.pathname.includes('search') && <span><RiSearchFill /></span>}
                    <p>Search</p></NavLink></li>
                <li><NavLink to="collection" className=" flex align-center">
                    {!location.pathname.includes('collection') && <span><IoLibraryOutline /></span>}
                    {location.pathname.includes('collection') && <span><IoLibrary /></span>}
                    <p>Your Library</p></NavLink></li>
                {screenWidth < 770 && <li><NavLink to="queue" className="flex align-center">
                    <span><TiThListOutline /></span><p>Queue</p></NavLink></li>}
            </ul>
            {screenWidth > 770 && <div className="nav-links-second">
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
            </div>}
        </nav>
    )
}