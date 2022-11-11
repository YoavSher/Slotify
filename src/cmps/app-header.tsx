import { ChangeEvent, useEffect, useState, MouseEvent } from "react"
import { useLocation, useParams } from "react-router-dom"

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { BsPerson } from 'react-icons/bs'
import { FiSearch } from 'react-icons/fi'

import { useAppDispatch } from "../store/store.hooks"
import { youtubeService } from "../services/youtube.service"
import { setSearchResults } from "../store/search/search.reducer"
import { utilService } from "../services/util.service"


export const AppHeader = (props: any) => {

    const location = useLocation()
    const dispatch = useAppDispatch()




    const onSearch = async (ev: ChangeEvent<HTMLInputElement>) => {
        const { value } = ev.target

        try {
            const resData = await youtubeService.getDataFromYoutube(value)

            console.log('resData:', resData)
            dispatch(setSearchResults(resData))
        } catch (err) {
            console.log('err:', err)
        }
    }

    return (
        <section className="app-header flex align-center justify-between">
            <div className="header-nav-btns flex">
                <button className="nav-btn-back"><span><FiChevronLeft /></span></button>
                <button className="nav-btn-back"><span><FiChevronRight /></span></button>
            </div>
            {location.pathname.includes("/search") && <div className="search-bar-container">
                <div className="search-form-container">
                    <form>
                        <input type="text"
                            onChange={utilService.debounce(onSearch, 1000)}
                     placeholder="What do you want to listen to?"
                     />
                    </form>
                    <div className="search-icon-container"><span><FiSearch /></span></div>
                </div>
            </div>
            }
            <div className="header-user flex align-center"><span><BsPerson /></span><h4>User</h4></div>
        </section>
    )
}