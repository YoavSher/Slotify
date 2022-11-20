import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { BsSpotify, BsPlusSquare } from 'react-icons/bs'
import { RiHome2Line, RiHeartFill } from 'react-icons/ri'
import { FiSearch } from 'react-icons/fi'
import { VscLibrary } from 'react-icons/vsc'
import { playlistService } from "../services/playlist.service"
import { useAppSelector } from "../store/store.hooks"


export const AppNavbar = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const playlists = useAppSelector(state => state.playlist.playlists)


    useEffect(() => {
        // console.log('location:', location)
    }, [location])

    const onCreateNewBoard = async () => {
        const newPlaylist = await playlistService.createPlaylist()
        navigate(`playlist/${newPlaylist._id}`)
    }
    

    return (
        <nav className="app-navbar flex column">
            <h1 className="main-logo"><span><BsSpotify /></span> Slotify</h1>
            <ul className="nav-links-main">
                <li><Link to="" className="flex align-center"><span><RiHome2Line /></span><p>Home</p></Link></li>
                <li><Link to="search" className="flex align-center"><span><FiSearch /></span> <p>Search</p></Link></li>
                <li><Link to="" className="flex align-center"><span><VscLibrary /></span><p>Your Library</p></Link></li>
            </ul>
            <div className="nav-links-second">
                <div className="flex align-center" onClick={onCreateNewBoard}>
                    <span><BsPlusSquare /></span><p>Create Playlist</p>
                </div>
                <div className="flex">
                    <Link to='' className="flex align-center">
                        <span><div><RiHeartFill /></div></span><p>Liked Songs</p></Link>
                </div>
                <div className="bottom-border">
                    <hr />
                    <div className="separator"></div>
                </div>
                <div className="playlists-links">
                    <div className="playlists-links-container">
                        <div className="scroll-container"></div>
                        <ul>
                            <div>
                                {playlists?.map(p => {
                                    return <li key={p._id}><Link to={`playlist/${p._id}`}>{p.name}</Link></li>
                                })}
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}