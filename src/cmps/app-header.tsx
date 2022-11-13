import { ChangeEvent, useEffect, useState, MouseEvent } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { BsPerson } from 'react-icons/bs'


import { SearchBar } from "./search-bar"


export const AppHeader = () => {

    const location = useLocation()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const onGoBack = () => {
        navigate(-1)
    }


    return (
        <section className="app-header flex align-center justify-between">
            <div className="header-nav-btns flex">
                <button onClick={onGoBack} className="nav-btn-back"><span><FiChevronLeft /></span></button>
                <button className="nav-btn-back"><span><FiChevronRight /></span></button>
            </div>
            {location.pathname.includes("/search") && 
            <div className="search-bar-header"><SearchBar /></div>}
            <div className="header-user flex align-center"><span><BsPerson /></span><h4>User</h4></div>
        </section>
    )
}