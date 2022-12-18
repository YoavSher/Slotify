import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Song } from "../interfaces/song"
import { playlistService } from "../services/playlist.service"
import { songService } from "../services/songs.service"
import { utilService } from "../services/util.service"
import { youtubeService } from "../services/youtube.service"
import { setSearchedPlaylists, setSearchResults } from "../store/search/search.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"

export const useGetResultsFromParams = () => {
    const dispatch = useAppDispatch()
    const playlists = useAppSelector(state => state.playlist.playlists)
    const location = useLocation()
    const searchTerm = location.pathname.slice(8).replaceAll(/%20/gi, ' ')
    useEffect(() => {
        console.log('searchTerm: ', searchTerm);

        if (searchTerm) getResultsFromParams(searchTerm)
        return () => {
            dispatch(setSearchResults(null))
            dispatch(setSearchedPlaylists(null))
        }
    }, [location])

    const getResultsFromParams = async (term: string) => {
        try {
            let songsSearchResults: Song[] | undefined = await youtubeService.getDataFromYoutube(term)
            if (!songsSearchResults) songsSearchResults = await songService.searchSongs(term)
            if (songsSearchResults) {
                let playlistsSearchResults = await playlistService.getSearchedPlaylist({ songs: songsSearchResults, searchTerm: term })
                if (playlistsSearchResults.length === 0) playlistsSearchResults = noPlaylistsFound()
                dispatch(setSearchResults(songsSearchResults))
                dispatch(setSearchedPlaylists(playlistsSearchResults))
            }

        } catch (err) {
            console.log('err:', err)
        }
    }

    const noPlaylistsFound = () => {
        const newPlaylists = []
        const stack = new Set()
        for (let i = 0; i < 4; i++) {
            const randNum = utilService.randomInt(0, playlists?.length || 2)
            if (stack.has(randNum)) {
                newPlaylists.splice(i, 1)
                i--
            }
            const playlist = playlists?.find((p, idx) => idx === randNum)
            newPlaylists.push(playlist)
            stack.add(randNum)
        }
        return newPlaylists
    }

    return { getResultsFromParams }
}