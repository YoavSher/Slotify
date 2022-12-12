import React, { ChangeEvent, useEffect, useState } from "react"

import { FiSearch } from 'react-icons/fi'
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { playlistService } from "../services/playlist.service"

import { utilService } from "../services/util.service"
import { youtubeService } from "../services/youtube.service"
import { setSearchedPlaylists, setSearchResults } from "../store/search/search.reducer"
import { useAppDispatch } from "../store/store.hooks"

interface Props {
    fromResults?: boolean
}

export const SearchBar = ({ fromResults }: Props) => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()
    const searchTerm = location.pathname.slice(8).replaceAll(/%20/gi, ' ')
    // const { searchTerm } = params
    // const [searchTerm, setSearchTerm] = useState('')
    useEffect(() => {
        console.log('location:', location)
        getResultsFromParams(searchTerm)
    }, [location])

    const getResultsFromParams = async (term: string) => {
        console.log('im results from params')
        try {
            const songsSearchResults = await youtubeService.getDataFromYoutube(term)
            const playlistsSearchResults = await playlistService.getSearchedPlaylist(term)
            // console.log('playlistsSearchResults:', playlistsSearchResults)
            dispatch(setSearchResults(songsSearchResults))
            dispatch(setSearchedPlaylists(playlistsSearchResults))

        } catch (err) {
            console.log('err:', err)
        }
    }

    const onSearch = (ev: ChangeEvent<HTMLInputElement>) => {
        let { value } = ev.target
        value = value.includes('/') ? value.replace(/\//g, '-') : value
        getResultsFromParams(value)
        value ? navigate(`/search/${value}`) : navigate(`/search`)
    }

    return (
        <section className="search-bar-container">
            <div className="search-form-container">
                <form>
                    <input type="text"
                        onChange={utilService.debounce(onSearch, 1200)}
                        placeholder="What do you want to listen to?"
                        defaultValue={searchTerm}
                    />
                </form>
                <div className="search-icon-container"><span><FiSearch /></span></div>
            </div>
        </section>
    )
}