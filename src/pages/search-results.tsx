import {useState, useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
import { Song } from "../interfaces/song"
import { utilService } from "../services/util.service"
import { useAppSelector } from "../store/store.hooks"



export const SearchResults = () => {

    
    const [topSongs, setTopSongs] = useState<Song[] | undefined>()
    const searchResults = useAppSelector(state => state.searchSong.searchResults)
   

    useEffect(() => {
        console.log('searchResults:', searchResults)
        if (searchResults) {
            const songs = [...searchResults]
            setTopSongs(songs.splice(1))
            console.log('songs:', songs)
        }
        console.log('topSongs:', topSongs)
        
    }, [searchResults])



    return (
        <>

            <section className="search-pg">

                {searchResults && <section className="search-results flex ">
                    <div className="top-result">
                        <h1>Top Result</h1>
                        <div >
                            <img src={searchResults[0]?.image} alt="" />
                            <h3>{searchResults[0].title}</h3>
                        </div>
                    </div>
                    <div className="top-songs flex align-center column">
                        <h1>Songs</h1>
                        {topSongs?.map(s => {
                            return <div key={s.id} className="flex align-center justify-between">
                                <div className="flex">
                                    <img src={s.image} alt="" />
                                    <div>
                                        <h5>{s.title}</h5>
                                    </div>
                                </div>
                                <div>
                                    <p>{utilService.millisToMinutesAndSeconds(s.duration)}</p>
                                </div>
                            </div>
                        })}
                    </div>
                </section>}
            </section>
        </>

    )
}