import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'

import { Song } from "../interfaces/song"
import { utilService } from "../services/util.service"
import { useAppSelector } from "../store/store.hooks"



export const SearchResults = () => {


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

        <section className="search-results-page">
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
                            {topSongs?.map(s => {
                                return <div key={s.id} className="top-songs-results flex align-center  justify-between">
                                    <div className="top-song flex align-center">
                                        <div className="img-container">
                                            <img src={s.image} alt="" />
                                        </div>
                                        <div className="song-description">
                                            <div className="song-title">
                                            <h5>{s.title}</h5>

                                            </div>
                                            <h6>{s.channel}</h6>
                                        </div>
                                    </div>
                                    <div className="song-actions flex align-center">
                                        <p>{utilService.millisToMinutesAndSeconds(s.duration)}</p>
                                        <button>
                                            <span><HiOutlineDotsHorizontal /></span>
                                        </button>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </section>}
                {!searchResults && <section className="search-resluts-default">
                    <h1> this is default</h1>
                </section>}
            </div>
        </section>

    )
}