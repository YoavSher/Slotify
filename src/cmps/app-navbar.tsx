import { Link } from "react-router-dom"
import { BsSpotify } from 'react-icons/bs'
import { GrHomeRounded } from 'react-icons/gr'
import { FiSearch } from 'react-icons/fi'


export const AppNavbar = () => {
    return (
        <nav className="app-navbar flex column">
            <h1><span><BsSpotify /></span> Slotify</h1>
            <ul className="nav-links">
                <li><Link to=""><span><GrHomeRounded/></span> Home</Link></li>
                <li><Link to="search"><span><FiSearch/></span> Search</Link></li>
                {/* <li><Link to="">Your Library</Link></li> */}
            </ul>

        </nav>
    )
}