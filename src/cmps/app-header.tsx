import { Location, useLocation, useNavigate, useParams } from "react-router-dom"
import { UserHeaderDisplay } from './user-header-display'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { BsPerson } from 'react-icons/bs'

import { SearchBar } from "./search-bar"
import { useEffect, useState } from "react"

export const AppHeader = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const [locations, setLocations] = useState<Location[]>([])
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)

    useEffect(() => {
        window.addEventListener('resize', setDimensions)
        return () => {
            window.removeEventListener('resize', setDimensions)
        }
    }, [])

    const onGoBack = () => {
        setLocations((prev: Location[]) => ([location, ...prev]))
        navigate(-1)
    }
    const onGoForward = () => {
        setLocations(prev => {
            prev.shift()
            return prev
        })
        navigate(locations[0].pathname)
    }
    const setDimensions = () => {
        setScreenWidth(window.innerWidth)
    }

    return (
        <section className="app-header flex align-center justify-between">
            <div className="header-nav-btns flex">
                <button onClick={onGoBack} className="nav-btn-back"><span><FiChevronLeft /></span></button>
                <button disabled={locations.length === 0} onClick={onGoForward} className="nav-btn-back"><span><FiChevronRight /></span></button>
            </div>
            {location.pathname.includes("/search") && screenWidth > 770 &&
                <div className="search-bar-header"><SearchBar /></div>}

            <UserHeaderDisplay />
        </section>
    )
}