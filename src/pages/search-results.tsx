import { useState, useEffect } from "react"
import { Params, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from 'react-icons/bs'

import { Song } from "../interfaces/song"

import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { Helmet } from "react-helmet"
import { SongPreview } from "../cmps/song-preview-cmps/song-preview"
import { SongsModal } from "../cmps/songs-modal"
import { replacePlaylist, setIsSongPlaying } from "../store/music-player/music-player.reducer"
import { SearchBar } from "../cmps/search-bar"
import { useSongModal } from "../hooks/useSongModal"
import { Playlist } from "../interfaces/playlist"
import { usePlayPlaylistPreview } from "../hooks/usePlayPlaylistPreview"
import { PlaylistPreview } from "../cmps/playlist-perview-cmps/playlist-preview"
import { Loader } from "../cmps/loader"
import { useIsMobile } from "../hooks/useIsMobile"



export const SearchResults = () => {

    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const queueSongs = useAppSelector(state => state.musicPlayer.songs)
    const dispatch = useAppDispatch()
    const { toggleModal, closeModal, isModalOpen, songForModal, modalPos } = useSongModal()
    const songsSearchedResults = useAppSelector(state => state.searchSong.searchResults)
    const playlistsSearchedResults = useAppSelector(state => state.searchSong.searchedPlaylists)
    const { isMobile, screenWidth } = useIsMobile()
    const params = useParams()

    const { topResult, topSongs } = useSearchResults(songsSearchedResults, playlistsSearchedResults, params)
    const { onSetPlaylist, isPlaylistPlaying } = usePlayPlaylistPreview(topResult as Playlist, null)
    const isThisSongPlaying = () => {

        if (songsSearchedResults) {
            return isSongPlaying && songsSearchedResults[0].videoId === queueSongs[0].videoId
        }
    }
    const onClickPlay = () => {
        if (songsSearchedResults) {
            if (!isSongPlaying && songsSearchedResults[0].videoId === queueSongs[0]?.videoId) dispatch(setIsSongPlaying(true))
            else if (isThisSongPlaying()) dispatch(setIsSongPlaying(false))
            else dispatch(replacePlaylist(songsSearchedResults[0]))


        }

    }

    if (!songsSearchedResults && params.searchTerm) return <Loader/>
    return (
        <>
            <section onClick={closeModal} onScroll={closeModal} className="search-results-page">
                <Helmet><title>Slotify - Search</title></Helmet>
                {isMobile && <div className="search-bar-results"><SearchBar fromResults={true} /></div>}
                <div className="search-results-container">
                    {songsSearchedResults && playlistsSearchedResults &&
                        <section className="search-results flex ">
                            {/* <div className="top-result">
                                <div className="top-result title">
                                    <h1>Top Result</h1>
                                </div>
                                <div className="top-result-content">
                                    <div className="top-result content-container">
                                        <div className="img-container">
                                            <img src={topResult?.image} alt="" />
                                        </div>
                                        {playlistsSearchedResults && <h3>{topResult?.name}</h3>}
                                        {!playlistsSearchedResults && <h3>{topResult?.title}</h3>}
                                        <div className="top-result icon-container">
                                            {playlistsSearchedResults.length > 0 && <button onClick={onSetPlaylist}>
                                                <span>{!isPlaylistPlaying ? <BsFillPlayCircleFill /> : <BsFillPauseCircleFill />}</span>
                                            </button>}
                                            {playlistsSearchedResults.length === 0 && <button onClick={onClickPlay}>
                                                <span>{!isThisSongPlaying() ? <BsFillPlayCircleFill /> : <BsFillPauseCircleFill />}</span>
                                            </button>}
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="top-songs flex column">
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
                            </div>
                            {topResult && <div className="playlists-results">
                                <h1>Playlists</h1>
                                <div className="playlists-results-container">
                                    <PlaylistPreview playlistPre={topResult} />
                                </div>
                            </div>}
                        </section>}
                    {/* {songsSearchedResults && isMobile && <section className="search-results flex ">
                        <div className="top-songs-results-container">
                            {songsSearchedResults.map(song => {
                                return <SongPreview
                                    key={song.videoId}
                                    toggleModal={toggleModal}
                                    song={song}
                                    type={'search-results'}
                                    screenWidth={screenWidth} />
                            })}
                            {isModalOpen && songForModal && < SongsModal closeModal={closeModal} isMobile={isMobile} song={songForModal} modalPos={modalPos} />}
                        </div>
                    </section>} */}
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
    const [topResult, setTopResult] = useState<Playlist>()
    useEffect(() => {
        console.log('params:', params)
        getResults()
    }, [songsSearchedResults, params])
    const getResults = () => {
        if (songsSearchedResults && playlistsSearchedResults) {
            const songs = [...songsSearchedResults]
            // songs.splice(4)
            if (playlistsSearchedResults.length > 0) {
                setTopResult(playlistsSearchedResults[0])
                setTopSongs(songs)
            }
            // else {
            //     setTopResult(songs[0])
            //     setTopSongs(songs)
            // }
        }
    }
    return { topResult, topSongs }
}