import { SearchSongPreview } from "../cmps/search-song-preview"
import { SongPreview } from "../cmps/song-preview"
import { SongsQueueList } from "../cmps/songs-queue-list"
import { useAppSelector } from "../store/store.hooks"
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export const Queue = () => {

    const songs = useAppSelector(state => state.musicPlayer.currPlaylist.songs)
    const songIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const navigate = useNavigate()
    // useEffect(()=>{
    //     if ()
    // })
    return (
        <section className="queue-page">
            <h3 className="title">Queue</h3>
            <h4 className="mini-title">Now playing</h4>
            <SongPreview song={songs[songIdx]} index={songIdx} type={'queue'} />
            <h4 className="mini-title">Next in queue</h4>
            <SongsQueueList songIdx={songIdx} songs={songs} />
        </section>
    )
}