import { useEffect, useState } from "react"
import { BiPlay } from "react-icons/bi"
import { GiPauseButton } from "react-icons/gi"
import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { BsFillPlayFill } from "react-icons/bs"
import { Song } from "../interfaces/song"
import { utilService } from "../services/util.service"
import { addToPlaylist, removeSong, replacePlaylist, setIsSongPlaying, setPlayingIdx } from "../store/music-player/music-player.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"

interface Props {
    song: Song,
    type?: string,
    index?: number,
    toggleModal?: any
}
export const SongPreview = ({ song, type, index, toggleModal }: Props) => {

    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const currPlayingIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const playlist = useAppSelector(state => state.musicPlayer.currPlaylist)
    const dispatch = useAppDispatch()
    const [isHover, setIsHover] = useState(false)


    const isThisSongPlaying = () => {
        switch
        (type) {
            case 'queue':
                return isSongPlaying && currPlayingIdx === index
            case 'playlist-details':
                return isSongPlaying && currPlayingIdx === index
            case 'search-results':
                return isSongPlaying && song.id === playlist.songs[0].id
        }
    }

    const onClickPlay = () => {
        switch (type) {
            case 'queue':
                if (isThisSongPlaying()) dispatch(setIsSongPlaying(false)) // if the song thats playing is this ,stop it 
                else if (currPlayingIdx === index && !isSongPlaying) dispatch(setIsSongPlaying(true)) //else if the song is not playing and is this play it 
                else if (index !== undefined) dispatch(setPlayingIdx(index))                                                         // else if this song is not the song and not playing dispatch it
                break
            case 'search-results':
                if (!isSongPlaying && song.id === playlist?.songs[0]?.id) dispatch(setIsSongPlaying(true))
                else if (isThisSongPlaying()) dispatch(setIsSongPlaying(false))
                else dispatch(replacePlaylist(song))
                break
            case 'playlist-details':
                if (isThisSongPlaying()) dispatch(setIsSongPlaying(false)) // if the song thats playing is this ,stop it 
                else if (currPlayingIdx === index && !isSongPlaying) dispatch(setIsSongPlaying(true)) //else if the song is not playing and is this play it 
                else if (index !== undefined) dispatch(setPlayingIdx(index))                                                         // else if this song is not the song and not playing dispatch it
                break

        }
        // should dispatch the songId and then search the playlist to see where it is and set it as the index
        // but in the queue it should be like that maybe in other variation we want to just add it so maybe check if it's there if it is 
    }

    return (<>
        {/* ${(isModalOpen) ? 'modal-open' : ''} turn it to a prop from the father,the prop of which song if they are equal then it is open, */}
        <div className={`top-songs-results flex align-center justify-between `} onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <div className="top-song flex align-center">
                {(type === 'queue' || type === 'playlist-details') && index !== undefined && <div className="index-display">
                    {!isThisSongPlaying() && <p>{index + 1}</p>}
                    {isThisSongPlaying() && !isHover && song?.id === playlist?.songs[currPlayingIdx]?.id&&<div className="volume-gif">
                        <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt=""
                        />
                    </div>}
                    <button className={`play-pause-btn ${isThisSongPlaying() ? 'pause' : 'play'}`} onClick={onClickPlay}>{isThisSongPlaying() ? <GiPauseButton /> : <BiPlay />}</button>
                </div>}
                <div className="img-container">
                    <img src={song.image} alt="" />
                    {type === 'search-results' &&
                        <button className="photo-play"
                            onClick={onClickPlay}>
                            <span>{isThisSongPlaying() ? <GiPauseButton /> : <BiPlay />}</span>
                        </button>}
                </div>
                <div className="song-description">
                    <div className="song-title">
                        {type === 'search-results' && <h5 className={`${song?.id === playlist?.songs[0]?.id ? 'playing' : ''}`}>
                            {song.title}</h5>}
                        {(type === 'playlist-details' || type === 'queue') &&
                            <h5 className={`${song?.id === playlist?.songs[currPlayingIdx]?.id ? 'playing' : ''}`}>
                                {song.title}</h5>}
                    </div>
                    <h6>{song.artist}</h6>
                </div>
            </div>
            <div className="song-actions flex align-center">
                <p>{utilService.millisToMinutesAndSeconds(song.duration)}</p>
                <button onClick={(event) => { toggleModal(event, song) }} className="actions-btn">

                    <span><HiOutlineDotsHorizontal /></span>
                </button>

            </div>
        </div>
    </>)
}