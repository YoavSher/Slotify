import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { BsSpotify, BsPlusSquare } from 'react-icons/bs'
import { RiHome2Line } from 'react-icons/ri'
import { FiSearch } from 'react-icons/fi'
import { VscLibrary } from 'react-icons/vsc'
import { playlistService } from "../services/playlist.service"


export const AppNavbar = () => {

    const navigate = useNavigate()
    const location = useLocation()


    useEffect(() => {
        // console.log('location:', location)
    }, [location])

    const onCreateNewBoard = async () => {
        const newPlaylist = await playlistService.createPlaylist()
        navigate(`playlist/${newPlaylist._id}`)
    }

    return (
        <nav className="app-navbar flex column">
            <h1><span><BsSpotify /></span> Slotify</h1>
            <ul className="nav-links">
                <li><Link to=""><span><RiHome2Line /></span> Home</Link></li>
                <li><Link to="search"><span><FiSearch /></span> Search</Link></li>
                <li><Link to=""><span><VscLibrary /></span>Your Library</Link></li>
            </ul>
            <div>
                <div className="flex" onClick={onCreateNewBoard}>
                    <span><BsPlusSquare /></span>Create Playlist
                </div>
            </div>
        </nav>
    )
}