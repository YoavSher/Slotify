import React, { ChangeEvent, useEffect, useState } from "react"

import { FiSearch } from 'react-icons/fi'
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useGetResultsFromParams } from "../../hooks/useGetResultsFromParams"
import { Song } from "../../interfaces/song"
import { playlistService } from "../../services/playlist.service"
import { songService } from "../../services/songs.service"

import { utilService } from "../../services/util.service"
import { youtubeService } from "../../services/youtube.service"
import { setSearchedPlaylists, setSearchResults, setSearchTerm } from "../../store/search/search.reducer"
import { useAppDispatch, useAppSelector } from "../../store/store.hooks"


export const SearchBar = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useAppDispatch()
    const { getResultsFromParams } = useGetResultsFromParams()
    const searchTerm = useAppSelector(state => state.searchSong.searchTerm)

    const onSearch = (ev: ChangeEvent<HTMLInputElement>) => {
        let { value } = ev.target
        value = value.includes('/') ? value.replace(/\//g, '-') : value
        dispatch(setSearchTerm(value))
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
                        defaultValue={searchTerm || ''}
                    />
                </form>
                <div className="search-icon-container"><span><FiSearch /></span></div>
            </div>
        </section>
    )
}


