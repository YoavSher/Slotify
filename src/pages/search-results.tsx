import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { BsFillPlayCircleFill } from 'react-icons/bs'

import { Song } from "../interfaces/song"

import { useAppSelector } from "../store/store.hooks"
import { Helmet } from "react-helmet"
import { SearchSongPreview } from "../cmps/search-song-preview"
import { SongPreview } from "../cmps/song-preview"
import { SongsModal } from "../cmps/songs-modal"



export const SearchResults = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [songForModal, setSongForModal] = useState<Song | null>(null)
    const [modalPos, setModalPos] = useState<{ left: number, top: number }>({ left: 0, top: 0 })
    const openModal = (ev: any, song: Song) => {
        ev.stopPropagation()
        const { left, top } = ev.target.getBoundingClientRect()
        setModalPos({ left, top })
        setSongForModal(song)
        setIsModalOpen(true)
    }
    const closeModal = () => {
        setSongForModal(null)
        setIsModalOpen(false)
    }


    const searchResults = useAppSelector(state => state.searchSong.searchResults)
    const [topSongs, setTopSongs] = useState<Song[] | undefined>()
    const params = useParams()






    useEffect(() => {
        console.log('searchResults:', searchResults)
        if (searchResults) {

            const songs = [...searchResults]
            setTopSongs(songs.splice(1))
            console.log('songs:', songs)
        }

    }, [searchResults])


    return (
        <>
        <section onClick={closeModal} className="search-results-page">
            <Helmet><title>Slotify - Search</title></Helmet>
            <div className="search-results-container">
                {searchResults && <section className="search-results flex ">
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
                                    <button><span><BsFillPlayCircleFill /></span></button>
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
                                return <SongPreview openModal={openModal} song={song} 
                                type={'search-results'}/>
                            })}
                        </div>
                    </div>
                </section>}
                {!searchResults && <section className="search-resluts-default">
                    <h1> this is default</h1>
                </section>}
            </div>
        </section>
        {isModalOpen && <SongsModal closeModal={closeModal} song={songForModal} modalPos={modalPos} />}
        </>

    )
}