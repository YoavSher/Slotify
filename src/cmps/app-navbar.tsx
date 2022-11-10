import { Link } from "react-router-dom"
import { BsSpotify } from 'react-icons/bs'


export const AppNavbar = () => {
    return (
        <nav className="app-navbar flex column">
            <h1><span><BsSpotify /></span> Slotify</h1>
            <ul>
                <li><Link to="">Home</Link></li>
                <li><Link to="search">Search</Link></li>
                {/* <li><Link to="">Your Library</Link></li> */}
            </ul>

        </nav>
    )
}