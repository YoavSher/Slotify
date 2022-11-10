import { ChangeEvent, useEffect, useState, MouseEvent } from "react"
import { useLocation, useParams } from "react-router-dom"
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { BsPerson } from 'react-icons/bs'
import { useAppDispatch } from "../store/store.hooks"
import { youtubeService } from "../services/youtube.service"
import { setSearchResults } from "../store/search/search.reducer"


export const AppHeader = (props: any) => {
    // const { handleTextChange, searchTerm } = props
    const [searchTerm, setSearchTerm] = useState('')
    const location = useLocation()
    const dispatch = useAppDispatch()



    const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
        const { value } = ev.target
        setSearchTerm(value)
        // handleTextChange(txt)
    }

    const onSearch = async (ev: MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault()
        // ev.stopPropagation()
        try {
            const resData = await youtubeService.getDataFromYoutube(searchTerm)
            // setResults(resData)
            // const songs = resData?.splice(1)
            // setTopSongs(songs)
            // console.log('results:', results)
            console.log('resData:', resData)
            dispatch(setSearchResults(resData))
        } catch (err) {
            console.log('err:', err)
        }
    }

    return (
        <section className="app-header flex align-center justify-between">
            <div className="header-nav-btns">
                <button><FiChevronLeft /></button>
                <button><FiChevronRight /></button>
            </div>
            {location.pathname.includes("/search") && <form>
                <input type="text"
                    onChange={handleChange}
                    value={searchTerm} />
                <button onClick={onSearch}>Search</button>
            </form>}
            <div className="header-user flex align-center"><span><BsPerson /></span><h4>User</h4></div>
        </section>
    )
}