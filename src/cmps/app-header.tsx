import { Location, useLocation, useNavigate, useParams } from "react-router-dom"
import { UserHeaderDisplay } from './user-header-display'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { BsPerson } from 'react-icons/bs'

import { SearchBar } from "./search-bar"
import { useState } from "react"

export const AppHeader = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const [locations, setLocations] = useState<Location[]>([])

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


    return (
        <section className="app-header flex align-center justify-between">
            <div className="header-nav-btns flex">
                <button onClick={onGoBack} className="nav-btn-back"><span><FiChevronLeft /></span></button>
                <button disabled={locations.length === 0} onClick={onGoForward} className="nav-btn-back"><span><FiChevronRight /></span></button>
            </div>
            {location.pathname.includes("/search") &&
                <div className="search-bar-header"><SearchBar /></div>}

            <UserHeaderDisplay />
        </section>
    )
}