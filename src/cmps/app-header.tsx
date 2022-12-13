import { Location, useLocation, useNavigate, } from "react-router-dom"
import { UserHeaderDisplay } from './user-header-display'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import { SearchBar } from "./search-bar"
import { useRef } from "react"
import { useIsMobile } from "../hooks/useIsMobile"
import { useAppSelector } from "../store/store.hooks"
import { playlistService } from "../services/playlist.service"

export const AppHeader = () => {

    const location = useLocation()
    const loggedInUser = useAppSelector(state => state.user.loggedInUser)
    const { isMobile } = useIsMobile()
    const navigate = useNavigate()
    const { onGoBack, onGoForward, locationsLength } = useHistoryStack()

    const onCreateNewPlaylist = async () => {
        if (!loggedInUser) return
        try {
            const newPlaylist = await playlistService.createPlaylist()
            navigate(`playlist/${newPlaylist._id}`)
        } catch (err) {
            console.log(err)
        }
    }

    const style = { background: (location.pathname.includes('playlist') ? 'transparent' : '#181818') }
    return (
        <section style={style} className="app-header flex align-center justify-between" >
            {!isMobile ? (
                <div className="header-nav-btns flex">
                    <button onClick={onGoBack} className="nav-btn-back"><span><FiChevronLeft /></span></button>
                    <button disabled={locationsLength <= 0} onClick={onGoForward} className="nav-btn-back"><span><FiChevronRight /></span></button>
                </div>
            ) : (
                <div className={`create-playlist flex align-center ${loggedInUser ? '' : 'disabled'}`} onClick={onCreateNewPlaylist}>
                    <div><span>+</span></div>
                </div>
            )}

            {
                location.pathname.includes("/search") && !isMobile &&
                <div className="search-bar-header"><SearchBar /></div>
            }

            <UserHeaderDisplay />
        </section >
    )
}

const useHistoryStack = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const locations = useRef<Location[]>([])
    const onGoBack = () => {
        locations.current.push(location)
        navigate(-1)
    }
    const onGoForward = () => {
        const location = locations.current.pop()
        if (location) navigate(location.pathname)
    }

    return { onGoBack, onGoForward, locationsLength: locations.current.length }
}