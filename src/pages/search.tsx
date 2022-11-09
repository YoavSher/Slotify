import { ChangeEvent, ReactEventHandler, useState } from "react"
import { Song } from "../interfaces/song"
import { youtubeService } from "../services/youtube.service"


export const Search = () => {

    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<Song[] | null | undefined>(null)

    const handleTextChange = (ev: ChangeEvent<HTMLInputElement>) => {
        const { value } = ev.target
        setSearchTerm(value)
    }

    const onSearch = async () => {
        try {
            const resData = await youtubeService.getDataFromYoutube(searchTerm)
            if (resData) setResults(resData)
            console.log('results:', results)
            console.log('resData:', resData)
        } catch (err) {
            console.log('err:', err)
        }
    }

    return (
        <section className="search-pg">
            <input type="text"
                onChange={handleTextChange}
                value={searchTerm} />
            <button onClick={onSearch}>Search</button>
            {results && <section className="search-results">
                <div className="top-result">
                    <h1>Top Result</h1>
                    <div >
                        <h3>{results[0].title}</h3>
                        <img src={results[0].image} alt="" />
                    </div>
                </div>
            </section>}
        </section>
    )
}