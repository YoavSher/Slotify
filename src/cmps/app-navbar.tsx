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
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const isMobile = screenWidth <= 770
    useEffect(() => {
        loadPlayList()
    }, [location])




    const onCreateNewPlaylist = async () => {
        const newPlaylist = await playlistService.createPlaylist()
        // navigate(`playlist/${newPlaylist._id}`)
    }
    const loadPlayList = async () => {
        const playlists = await playlistService.query()
        if (playlists) dispatch(setPlaylists(playlists))
    }
    // make the location.pathname.includes() a function with a nicer name(?), have inside cmps like pathways,and playlist list. isMobile 
    // maybe we can render the paths as a map only need to figure the thing with location.pathName for the exact thingy
    return (
        <nav className="app-navbar flex column">
            {!isMobile && <h1 className="main-logo flex"><span><BsSpotify /></span> Slotify</h1>}
            <ul className="nav-links-main">
                <li> 
                    <NavLink to="" className='flex align-center'>
                        {location.pathname === '/' ? <span><RiHome2Fill /></span> :
                            <span><RiHome2Line /></span>}
                        <p>Home</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="search" className='flex align-center'>
                        {location.pathname.includes('search') ? <span><RiSearchFill /></span> :
                            <span><FiSearch /></span>}
                        <p>Search</p>
                    </NavLink>
                </li>
                <li><NavLink to="collection" className=" flex align-center">
                    {location.pathname.includes('collection') ? <span><IoLibrary /></span> :
                        <span><IoLibraryOutline /></span>}
                    <p>Your Library</p>
                </NavLink>
                </li>
                {isMobile && (
                    <li><NavLink to="queue" className="flex align-center">
                        <span><TiThListOutline /></span><p>Queue</p>
                    </NavLink>
                    </li>
                )}
            </ul>
            {!isMobile && <div className="nav-links-second">
                <div className="create-playlist flex align-center" onClick={onCreateNewPlaylist}>
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