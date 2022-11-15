import { useState } from "react"
import { BiPlay } from "react-icons/bi"
import { GiPauseButton } from "react-icons/gi"
import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { Song } from "../interfaces/song"
import { utilService } from "../services/util.service"
import { addToPlaylist, setIsSongPlaying, setPlayingIdx } from "../store/music-player/music-player.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"

interface Props {
    song: Song,
    type?: string,
    index?: number
}
export const SongPreview = ({ song, type, index }: Props) => {

    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(prev => !prev)
    }

    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const currPlayingIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const dispatch = useAppDispatch()

    const isThisSongPlaying = () => {
        switch (type) {
            case 'queue':
                return isSongPlaying && currPlayingIdx === index
        }
    }

    const addSongToQueue = () => {
        dispatch(addToPlaylist(song))
    }
    const onClickPlay = () => {
        switch (type) {
            case 'queue':
                if (isThisSongPlaying()) dispatch(setIsSongPlaying(false)) // if the song thats playing is this ,stop it 
                else if (currPlayingIdx === index && !isSongPlaying) dispatch(setIsSongPlaying(true)) //else if the song is not playing and is this play it 
                else if (index !== undefined) dispatch(setPlayingIdx(index))                                                         // else if this song is not the song and not playing dispatch it
                break
        }
        // should dispatch the songid and then search the playlist to see where it is and set it as the index
        // but in the queue it should be like that maybe in other variation we want to just add it so maybe check if it's there if it is 
    }

    return (<div key={song.id} className={`top-songs-results flex align-center justify-between ${(isModalOpen) ? 'modal-open' : ''}`}>
        <div className="top-song flex align-center">
            {type === 'queue' && index !== undefined && <div className="index-display">
                <p>{index + 1}</p>
                <button className={`play-pause-btn ${isThisSongPlaying() ? 'pause' : 'play'}`} onClick={onClickPlay}>{isThisSongPlaying() ? <GiPauseButton /> : <BiPlay />}</button>
            </div>}
            <div className="img-container">
                <img src={song.image} alt="" />
            </div>
            <div className="song-description">
                <div className="song-title">
                    <h5>{song.title}</h5>

                </div>
                <h6>{song.artist}</h6>
            </div>
        </div>
        <div className="song-actions flex align-center">
            <p>{utilService.millisToMinutesAndSeconds(song.duration)}</p>
            <button onClick={toggleModal} className="actions-btn">
                <span><HiOutlineDotsHorizontal /></span>
            </button>
            {isModalOpen && <section className="options-modal">
                <button onClick={() => {
                    addSongToQueue()
                }}>Add to queue</button>

            </section>}
        </div>
    </div>)
}