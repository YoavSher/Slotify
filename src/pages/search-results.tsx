import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from 'react-icons/bs'

import { Song } from "../interfaces/song"

import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import { Helmet } from "react-helmet"
import { SearchSongPreview } from "../cmps/search-song-preview"
import { SongPreview } from "../cmps/song-preview"
import { SongsModal } from "../cmps/songs-modal"
import { replacePlaylist, setIsSongPlaying } from "../store/music-player/music-player.reducer"
import { SearchBar } from "../cmps/search-bar"
// import loading from '../assets/img/18544-music-play.gif'
import loading from '../assets/img/Spotify-Loading-Animation-4.gif'



export const SearchResults = () => {

    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const playlist = useAppSelector(state => state.musicPlayer.currPlaylist)
    const dispatch = useAppDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [songForModal, setSongForModal] = useState<Song | null>(null)
    const [modalPos, setModalPos] = useState<{ left: number, top: number }>({ left: 0, top: 0 })
    const searchResults = useAppSelector(state => state.searchSong.searchResults)
    const [topSongs, setTopSongs] = useState<Song[] | undefined>()
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const params = useParams()

    useEffect(() => {
        console.log('params:', params)
        if (searchResults) {

            const songs = [...searchResults]
            setTopSongs(songs.splice(1))
            console.log('songs:', songs)
        }
    }, [searchResults, params])


    const toggleModal = (ev: any, song: Song) => {
        ev.stopPropagation()
        const { left, top } = ev.target.getBoundingClientRect()
        setModalPos({ left, top })
        if (songForModal?.id === song.id) closeModal()
        else openModal(song)
    }

    const openModal = (song: Song) => {
        setSongForModal(song)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSongForModal(null)
        setIsModalOpen(false)
    }

    const isThisSongPlaying = () => {

        if (searchResults) {
            return isSongPlaying && searchResults[0].id === playlist.songs[0].id
        }
    }
    const onClickPlay = () => {
        if (searchResults) {
            if (!isSongPlaying && searchResults[0].id === playlist.songs[0]?.id) dispatch(setIsSongPlaying(true))
            else if (isThisSongPlaying()) dispatch(setIsSongPlaying(false))
            else dispatch(replacePlaylist(searchResults[0]))
        }

    }

    if (!searchResults && params.searchTerm) return <div className="loading-anim"><img src={loading} alt="" /></div>
    return (
        <>
            <section onClick={closeModal} onScroll={closeModal} className="search-results-page">
                <Helmet><title>Slotify - Search</title></Helmet>
                {screenWidth < 770 && <div className="search-bar-results"><SearchBar fromResults={true} /></div>}
                <div className="search-results-container">
                    {searchResults && screenWidth > 770 && <section className="search-results flex ">
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
                                    return <SongPreview key={song.id} toggleModal={toggleModal} song={song}
                                        type={'search-results'} />
                                })}
                                {isModalOpen && <SongsModal closeModal={closeModal} song={songForModal} modalPos={modalPos} />}
                            </div>
                        </div>
                    </section>}
                    {searchResults && screenWidth < 770 && <section className="search-results flex ">
                        <div className="top-songs-results-container">
                            {searchResults.map(song => {
                                return <SongPreview
                                    key={song.id}
                                    toggleModal={toggleModal}
                                    song={song}
                                    type={'search-results'}
                                    screenWidth={screenWidth} />
                            })}
                            {isModalOpen && <SongsModal closeModal={closeModal} song={songForModal} modalPos={modalPos} />}
                        </div>
                    </section>}
                    {!searchResults && <section className="search-resluts-default">
                    </section>}
                </div>
            </section>
        </>

    )
}