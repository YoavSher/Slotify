import { useState, useEffect } from "react"
import { Params, useParams } from "react-router-dom"

import { Song } from "../interfaces/song"

import { useAppSelector } from "../store/store.hooks"
import { Helmet } from "react-helmet"
import { SongPreview } from "../cmps/song-preview-cmps/song-preview"
import { SongsModal } from "../cmps/songs-modal"
import { SearchBar } from "../cmps/search-bar"
import { useSongModal } from "../hooks/useSongModal"
import { Playlist } from "../interfaces/playlist"
import { PlaylistPreview } from "../cmps/playlist-perview-cmps/playlist-preview"
import { Loader } from "../cmps/loader"
import { useIsMobile } from "../hooks/useIsMobile"
import { useGetResultsFromParams } from "../hooks/useGetResultsFromParams"
import { SearchFilter } from "../cmps/search-filter"



export const SearchResults = () => {
    const songsSearchedResults = useAppSelector(state => state.searchSong.searchResults)
    const playlistsSearchedResults = useAppSelector(state => state.searchSong.searchedPlaylists)
    const { isMobile, screenWidth } = useIsMobile()
    const params = useParams()
    const [showSongs, setShowSongs] = useState(true)
    const [showPlaylists, setShowPlaylists] = useState(true)

    const { toggleModal, closeModal, isModalOpen, songForModal, modalPos } = useSongModal()
    const { topResult, topSongs } = useSearchResults(songsSearchedResults, playlistsSearchedResults, params)
    const { getResultsFromParams } = useGetResultsFromParams()

    useEffect(() => {
        if (params.searchTerm) getResultsFromParams(params.searchTerm)
    }, [])

    const onFilterResults = (filterBy: string) => {
        switch (filterBy) {
            case 'all':
                setShowSongs(true)
                setShowPlaylists(true)
                break
            case 'songs':
                setShowSongs(true)
                setShowPlaylists(false)
                break
            case 'playlists':
                setShowSongs(false)
                setShowPlaylists(true)
                break
        }
    }

    if (!songsSearchedResults && params.searchTerm) return <Loader/>
    return (
        <>
            <section onClick={closeModal} onScroll={closeModal} className="search-results-page">
                <Helmet><title>Slotify - Search</title></Helmet>
                {isMobile && <div className="search-bar-results"><SearchBar fromResults={true} /></div>}
                <div className="search-results-container">
                    <SearchFilter
                     onFilterResults={onFilterResults}
                     showSongs={showSongs} 
                     showPlaylists={showPlaylists} />
                    {songsSearchedResults && playlistsSearchedResults &&
                        <section className="search-results flex ">

                            {showSongs && <div className="top-songs flex column">
                                <div className="top-songs title">
                                    <h1>Songs</h1>
                                </div>
                                <div className="top-songs-results-container">
                                    {topSongs?.map(song => {
                                        return <SongPreview
                                            key={song.videoId}
                                            screenWidth={screenWidth}
                                            toggleModal={toggleModal}
                                            song={song}
                                            type={'search-results'} />
                                    })}
                                    {isModalOpen && songForModal && < SongsModal isMobile={isMobile} closeModal={closeModal} song={songForModal} modalPos={modalPos} />}
                                </div>
                            </div>}
                            {topResult && showPlaylists && <div className="playlists-results">
                                <h1>Playlists</h1>
                                {showPlaylists && <div className="playlists-results-container">
                                    {topResult.map(p => {
                                        return <PlaylistPreview key={p._id} playlistPre={p} />
                                    })}

                                </div>}
                            </div>}
                        </section>}
                    {!songsSearchedResults && <section className="search-resluts-default">
                    </section>}
                </div>
                <div className="pusher"></div>
            </section>
        </>

    )
}

const useSearchResults = (songsSearchedResults: Song[] | null | undefined, playlistsSearchedResults: Playlist[] | null,
    params: Readonly<Params<string>>) => {
    const [topSongs, setTopSongs] = useState<Song[] | undefined>()
    const [topResult, setTopResult] = useState<Playlist[]>()
    useEffect(() => {
        console.log('params:', params)
        getResults()
    }, [songsSearchedResults, playlistsSearchedResults, params])
    const getResults = () => {
        if (songsSearchedResults && playlistsSearchedResults) {
            const songs = [...songsSearchedResults]
            setTopResult(playlistsSearchedResults)
            setTopSongs(songs)
        }
    }
    return { topResult, topSongs }
}