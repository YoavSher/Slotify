import React, { ChangeEvent, useState } from "react"

import { FiSearch } from 'react-icons/fi'
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

import { utilService } from "../services/util.service"
import { youtubeService } from "../services/youtube.service"
import { setSearchResults } from "../store/search/search.reducer"
import { useAppDispatch } from "../store/store.hooks"



export const SearchBar = () => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const params = useParams()
    // const [searchTerm, setSearchTerm] = useState('')


    const onSearch = async (ev: ChangeEvent<HTMLInputElement>) => {
        const { value } = ev.target
        // setSearchTerm(value) if we want 2 way data binding for the params
        try {
            const resData = await youtubeService.getDataFromYoutube(value)

            console.log('resData:', resData)
            // navigate(`search/${value}`) to go to search page with search term in params
            dispatch(setSearchResults(resData))
        } catch (err) {
            console.log('err:', err)
        }
    }

    return (
        <section className="search-bar-container">
            <div className="search-form-container">
                <form>
                    <input type="text"
                        onChange={utilService.debounce(onSearch, 1000)}
                        placeholder="What do you want to listen to?"
                        // value={searchTerm}
                    />
                </form>
                <div className="search-icon-container"><span><FiSearch /></span></div>
            </div>
        </section>
    )
}