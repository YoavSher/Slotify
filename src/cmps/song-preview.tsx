import { useEffect, useState } from "react"
import { BiPlay } from "react-icons/bi"
import { GiPauseButton } from "react-icons/gi"
import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { BsFillPlayFill } from "react-icons/bs"
import { Song } from "../interfaces/song"
import { utilService } from "../services/util.service"
import { addToPlaylist, removeSong, replacePlaylist, setIsSongPlaying, setPlayingIdx } from "../store/music-player/music-player.reducer"
import { useAppDispatch, useAppSelector } from "../store/store.hooks"
import userEvent from "@testing-library/user-event"
import { LikeButton } from "./like-button"

interface Props {
    song: Song,
    type: string,
    index?: number,
    toggleModal?: any,
    playSongFromPlaylist?: any,
    onAddToPlaylist?: any,
    screenWidth?: number
}
export const SongPreview = ({ song, type, index, toggleModal, playSongFromPlaylist, onAddToPlaylist, screenWidth }: Props) => {

    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const currPlayingIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const playlist = useAppSelector(state => state.musicPlayer.currPlaylist)
    const dispatch = useAppDispatch()
    const [isHover, setIsHover] = useState(false)


    const isThisSongPlaying = () => {
        switch
        (type) {
            case 'queue':
                return isSongPlaying && currPlayingIdx === index && song.id === playlist.songs[currPlayingIdx].id
            case 'playlist-details':
                return isSongPlaying && song.id === playlist.songs[currPlayingIdx].id // and it's this playlist
                // maybe make a boolean in playlist details and use it for the drag and drop aswell.
                // and pass it down as props i can even combine it 
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
                if (!isSongPlaying && currPlayingIdx === index && playlist.songs[currPlayingIdx].videoId === song.videoId) dispatch(setIsSongPlaying(true))
                else if (!isThisSongPlaying()) playSongFromPlaylist(index)
                else if (isThisSongPlaying()) dispatch(setIsSongPlaying(false))
                else dispatch(replacePlaylist(song))
                break
            case 'playlist-details-search':
                if (!isSongPlaying && currPlayingIdx === index && playlist.songs[currPlayingIdx].videoId === song.videoId) dispatch(setIsSongPlaying(true))
                else if (!isThisSongPlaying()) playSongFromPlaylist(index)
                else if (isThisSongPlaying()) dispatch(setIsSongPlaying(false))
                else dispatch(replacePlaylist(song)) // combine
                // maybe manage the width on the state if many components needs it because it's just alot of work on the same problem
                break

        }

    }
    const onPlayFromPhone = () => {
        if (screenWidth === undefined || screenWidth > 770) return
        onClickPlay()
    }

    const isMobileWithIndex = () => {
        return (type === 'queue' || type === 'playlist-details') && index !== undefined && screenWidth !== undefined && screenWidth > 770
    }

    return (<>
        <div className={`top-songs-results flex align-center`} onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} onClick={onPlayFromPhone}>
            <div className="top-song flex align-center">
                {isMobileWithIndex() && <div className="index-display">
                    {!isThisSongPlaying() && <p>{(index !== undefined) ? index + 1 : ''}</p>}
                    {isThisSongPlaying() && !isHover && song?.id === playlist?.songs[currPlayingIdx]?.id && <div className="volume-gif">
                        <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt=""
                        />
                    </div>}
                    {screenWidth !== undefined && screenWidth > 770 &&
                        <button className={`play-pause-btn ${isThisSongPlaying() ? 'pause' : 'play'}`}
                            onClick={onClickPlay}>{isThisSongPlaying() ? <GiPauseButton /> : <BiPlay />}</button>}
                </div>}
                <div className="img-container">
                    <img src={song.image} alt="" />
                    {(type === 'search-results' || type === 'playlist-details-search') &&
                        <button className="photo-play"
                            onClick={onClickPlay}>
                            <span>{isThisSongPlaying() ? <GiPauseButton /> : <BiPlay />}</span>
                        </button>}
                </div>
                <div className="song-description">
                    <div className="song-title">
                        {(type === 'search-results' || type === 'playlist-details-search')
                            && <h5 className={`${song?.id === playlist?.songs[0]?.id ? 'playing' : ''}`}>
                                {song.title}</h5>}
                        {(type === 'playlist-details' || type === 'queue') &&
                            <h5 className={`${song?.id === playlist?.songs[currPlayingIdx]?.id ? 'playing' : ''}`}>
                                {song.title}</h5>}
                    </div>
                    <h6>{song.artist}</h6>
                </div>
            </div>
            {type === 'playlist-details-search' &&
                <div className="add-to-playlist-btn"><button onClick={() => onAddToPlaylist(song)}>Add</button></div>}
            {type === 'playlist-details' && <div className="added-at">
                {song?.addedAt && utilService.getDetailedTime(song.addedAt)}
            </div>}
            {type !== 'playlist-details-search' && <LikeButton song={song} />}

            {type !== 'playlist-details-search' && <div className="song-actions flex align-center">
                {screenWidth !== undefined && screenWidth > 770 &&
                    <p>{utilService.millisToMinutesAndSeconds(song.duration)}</p>}
                <button onClick={(event) => { toggleModal(event, song) }} className="actions-btn">

                    <span><HiOutlineDotsHorizontal /></span>
                </button>

            </div>}
        </div>
    </>)
}