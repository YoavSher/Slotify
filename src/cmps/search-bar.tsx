import React, { ChangeEvent } from "react"

import { FiSearch } from 'react-icons/fi'

import { utilService } from "../services/util.service"
import { youtubeService } from "../services/youtube.service"
import { setSearchResults } from "../store/search/search.reducer"
import { useAppDispatch } from "../store/store.hooks"



export const SearchBar = () => {

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
        <section className="search-bar-container">
            <div className="search-form-container">
                <form>
                    <input type="text"
                        onChange={utilService.debounce(onSearch, 1000)}
                        placeholder="What do you want to listen to?"
                    />
                </form>
                <div className="search-icon-container"><span><FiSearch /></span></div>
            </div>
        </section>
    )
}