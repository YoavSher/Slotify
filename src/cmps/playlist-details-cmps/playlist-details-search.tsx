import { ChangeEvent, useEffect, useState } from "react"
import { FiSearch } from 'react-icons/fi'
import { Song } from "../../interfaces/song"
import { utilService } from "../../services/util.service"
import { youtubeService } from "../../services/youtube.service"
import { setPlayingIdx, setPlaylist } from "../../store/music-player/music-player.reducer"
import { useAppDispatch } from "../../store/store.hooks"
import { SongPreview } from "../song-preview-cmps/song-preview"

interface Props {
    playlistId: string | undefined,
    onAddToPlaylist: any,
    screenWidth:number
}

interface PseudoPlaylist {
    songs: Song[]
}

export const PlaylistDetailsSearch = ({ playlistId, onAddToPlaylist,screenWidth }: Props) => {

    const [searchResults, setSearchResults] = useState<Song[] | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    // const [pseudoPlaylist, setPseudoPlaylist] = useState<PseudoPlaylist | null>(null)
    const dispatch = useAppDispatch()
    const playlist: PseudoPlaylist = {
        songs: []
    }

    useEffect(() => {
        return () => {
            setSearchResults(null)
            setSearchTerm('')
            console.log('i died');

        }
    }, [playlistId])


    const onSearch = async (ev: ChangeEvent<HTMLInputElement>) => {
        const { value } = ev.target
        try {
            const resData = await youtubeService.getDataFromYoutube(value)
            setSearchResults(resData)

        } catch (err) {
            console.log('err:', err)
        }
        // console.log('value:', value)

    }

    const playSongFromPlaylist = (index: number) => {
        if (searchResults) {
            playlist.songs = searchResults
            dispatch(setPlaylist(playlist))
            dispatch(setPlayingIdx(index))
        }
    }

    return (
        <section className="playlist-details-search">
            <h1>Add songs to your playlist</h1>
            <form onSubmit={(ev) => { ev.preventDefault() }}>
                <input type="text"
                    onChange={utilService.debounce(onSearch, 1200)}
                    defaultValue={searchTerm} />
                <div className="search-icon-container"><span><FiSearch /></span></div>
            </form>
            {searchResults && <div className="details-search-results">
                {searchResults.map((s, idx) => {
                    return <SongPreview
                        key={s.videoId}
                        type={'playlist-details-search'}
                        song={s}
                        screenWidth={screenWidth}
                        index={idx}
                        onAddToPlaylist={onAddToPlaylist}
                        playSongFromPlaylist={playSongFromPlaylist}
                    />
                })}
            </div>}
        </section>
    )
}