import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from 'react-icons/bs'

import { Song } from "../interfaces/song"

import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { Helmet } from "react-helmet"
import { SongPreview } from "../cmps/song-preview-cmps/song-preview"
import { SongsModal } from "../cmps/songs-modal"
import { replacePlaylist, setIsSongPlaying } from "../store/music-player/music-player.reducer"
import { SearchBar } from "../cmps/search-bar"
import loading from '../assets/img/Spotify-Loading-Animation-4.gif'
import { useSongModal } from "../hooks/useSongModal"



export const SearchResults = () => {

    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const playlist = useAppSelector(state => state.musicPlayer.currPlaylist)
    const dispatch = useAppDispatch()
    const { toggleModal, closeModal, isModalOpen, songForModal, modalPos } = useSongModal()
    const searchResults = useAppSelector(state => state.searchSong.searchResults)
    const [topSongs, setTopSongs] = useState<Song[] | undefined>()
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const isMobile = screenWidth <= 770
    const params = useParams()

    useEffect(() => {
        console.log('params:', params)
        if (searchResults) {

            const songs = [...searchResults]
            setTopSongs(songs.splice(1))
        }
    }, [searchResults, params])

    const isThisSongPlaying = () => {

        if (searchResults) {
            return isSongPlaying && searchResults[0].videoId === playlist.songs[0].videoId
        }
    }
    const onClickPlay = () => {
        if (searchResults) {
            if (!isSongPlaying && searchResults[0].videoId === playlist.songs[0]?.videoId) dispatch(setIsSongPlaying(true))
            else if (isThisSongPlaying()) dispatch(setIsSongPlaying(false))
            else dispatch(replacePlaylist(searchResults[0]))
        }

    }

    if (!searchResults && params.searchTerm) return <div className="loading-anim"><img src={loading} alt="" /></div>
    return (
        <>
            <section onClick={closeModal} onScroll={closeModal} className="search-results-page">
                <Helmet><title>Slotify - Search</title></Helmet>
                {isMobile && <div className="search-bar-results"><SearchBar fromResults={true} /></div>}
                <div className="search-results-container">
                    {searchResults && !isMobile && <section className="search-results flex ">
                        <div className="top-result">
                            <div className="top-result title">
                                <h1>Top Result</h1>
                            </div>
                            <div className="top-result-content">
                                <div className="top-result content-container">
                                    <div className="img-container">
                                        <img src={searchResults[0]?.image} alt="" />
                                    </div>
                                    <h3>{searchResults[0].title}</h3>
                                    <div className="top-result icon-container">
                                        <button onClick={onClickPlay}>
                                            <span>{!isThisSongPlaying() ? <BsFillPlayCircleFill /> : <BsFillPauseCircleFill />}</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="top-songs flex column">
                            <div className="top-songs title">
                                <h1>Songs</h1>
                            </div>
                            <div className="top-songs-results-container">
                                {topSongs?.map(song => {
                                    return <SongPreview key={song.videoId} screenWidth={screenWidth} toggleModal={toggleModal} song={song}
                                        type={'search-results'} />
                                })}
                                {isModalOpen && songForModal && < SongsModal isMobile={isMobile} closeModal={closeModal} song={songForModal} modalPos={modalPos} />}
                            </div>
                        </div>
                    </section>}
                    {searchResults && !isMobile && <section className="search-results flex ">
                        <div className="top-songs-results-container">
                            {searchResults.map(song => {
                                return <SongPreview
                                    key={song.videoId}
                                    toggleModal={toggleModal}
                                    song={song}
                                    type={'search-results'}
                                    screenWidth={screenWidth} />
                            })}
                            {isModalOpen && songForModal && < SongsModal closeModal={closeModal} isMobile={isMobile} song={songForModal} modalPos={modalPos} />}
                        </div>
                    </section>}
                    {!searchResults && <section className="search-resluts-default">
                    </section>}
                </div>
            </section>
        </>

    )
}