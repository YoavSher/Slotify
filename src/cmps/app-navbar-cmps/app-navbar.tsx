import { MouseEvent, useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { BsSpotify } from 'react-icons/bs'
import { HiOutlineSpeakerWave } from 'react-icons/hi2'
import { RiHome2Line, RiHeartFill, RiHome2Fill, RiSearchFill } from 'react-icons/ri'
import { FiSearch } from 'react-icons/fi'
import { IoLibraryOutline, IoLibrary } from 'react-icons/io5'
import { HiOutlineQueueList, HiQueueList } from 'react-icons/hi2'

import { playlistService } from "../../services/playlist.service"
import { useAppDispatch, useAppSelector } from "../../store/store.hooks"
import { setPlaylists } from "../../store/playlist/playlist.reducer"
import { NavLinksList } from "./nav-links-list"
import { PlaylistLinks } from "./playlists-links"
import { NeedToLoginModal } from "../need-to-login-modal"
import { onPlaylistLike } from "../../store/user/user.reducer"


export const AppNavbar = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    // const playlists = useAppSelector(state => state.playlist.playlists)
    const playlists = useAppSelector(state => state.user.playlists)
    const dispatch = useAppDispatch()
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const queuePlaylistId = useAppSelector(state => state.musicPlayer.playlistId)
    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [txtType, setTxtType] = useState('')

    const isCurrPlaylistOnQueue = 0 === queuePlaylistId
    const isCurrPlaylistPlaying = isCurrPlaylistOnQueue && isSongPlaying
    const isMobile = screenWidth <= 770

    // useEffect(() => {
    //     loadPlayList()
    // }, [location])

    // const loadPlayList = async () => {
    //     const playlists = await playlistService.query()//show only users liked playlists
    //     if (playlists) dispatch(setPlaylists(playlists))
    // } //shouldn't exist - should be taken from store



    const onCreateNewPlaylist = async () => {
        if (!loggedInUser) {
            openModal('create playlist')
        }
        else {
            const newPlaylist = await playlistService.createPlaylist()
            dispatch(onPlaylistLike(newPlaylist))
            navigate(`playlist/${newPlaylist._id}`)
        }
    }

    const checkUser = (ev: MouseEvent<HTMLAnchorElement>) => {
        if (!loggedInUser) {
            ev.preventDefault()
            openModal('liked songs')
        }
    }

    const openModal = (type: string) => {
        setIsModalOpen(true)
        setTxtType(type)
    }

    const routes = [
        { location: '/', icon: <RiHome2Line />, activeIcon: <RiHome2Fill />, txt: 'Home', isRendered: true },
        { location: 'search', icon: <FiSearch />, activeIcon: <RiSearchFill />, txt: 'Search', isRendered: true },
        { location: 'collection', icon: <IoLibraryOutline />, activeIcon: <IoLibrary />, txt: 'Your Library', isRendered: true },
        { location: 'queue', icon: <HiOutlineQueueList />, activeIcon: <HiQueueList />, txt: 'Queue', isRendered: isMobile },
    ]

    return (
        <nav className="app-navbar flex column">
            {!isMobile && <h1 onClick={() => { navigate('/') }} className="main-logo flex"><span><BsSpotify /></span> Slotify</h1>}
            <NavLinksList routes={routes} />

            {!isMobile && <div className="nav-links-second">
                <div className="create-playlist flex align-center" onClick={onCreateNewPlaylist}>
                    <div><span>+</span></div><p>Create Playlist</p>
                </div>
                <div className="liked-songs flex" >
                    <NavLink to='/liked-songs' className="flex align-center" onClick={checkUser}>
                        <div><span><RiHeartFill /></span></div><p>Liked Songs</p>
                    </NavLink>
                    {isCurrPlaylistPlaying &&
                        <span className="nav-bar-playing"><HiOutlineSpeakerWave /></span>}
                </div>
                <div className="bottom-border">
                    <hr />
                    <div className="separator"></div>
                </div>
                {playlists && <PlaylistLinks playlists={playlists} />}
            </div>}
            {isModalOpen && <NeedToLoginModal type={txtType} setIsModalOpen={setIsModalOpen}/>}
        </nav>
    )
}