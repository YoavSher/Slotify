import { useEffect, useState } from "react"
import { BiPlay } from "react-icons/bi"
import { GiPauseButton } from "react-icons/gi"
import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { BsFillPlayFill } from "react-icons/bs"
import { PlaylistSong, Song } from "../interfaces/song"
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
    screenWidth: number
}
export const SongPreview = ({ song, type, index, toggleModal, playSongFromPlaylist, onAddToPlaylist, screenWidth }: Props) => {

    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const currPlayingIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const playlist = useAppSelector(state => state.musicPlayer.currPlaylist)
    const dispatch = useAppDispatch()
    const [isHover, setIsHover] = useState(false)

    const isCurrSong = song.videoId === playlist?.songs[currPlayingIdx]?.videoId
    const isMobile = screenWidth <= 770

    const isThisSongPlaying = () => {
        switch (type) {
            case 'queue':
                return isSongPlaying && currPlayingIdx === index && isCurrSong
            default:
                return isSongPlaying && isCurrSong
        }
    }

    const onClickPlay = () => {
        switch (type) {
            case 'queue':
                if (isThisSongPlaying()) dispatch(setIsSongPlaying(false))
                else if (currPlayingIdx === index && !isSongPlaying) dispatch(setIsSongPlaying(true))
                else if (index !== undefined) dispatch(setPlayingIdx(index))
                break
            case 'search-results':
                if (!isSongPlaying && isCurrSong) dispatch(setIsSongPlaying(true))
                else if (isThisSongPlaying()) dispatch(setIsSongPlaying(false))
                else dispatch(replacePlaylist(song))
                break
            case 'playlist-details-search':
            case 'playlist-details':
                if (!isSongPlaying && isCurrSong) dispatch(setIsSongPlaying(true))
                else if (isThisSongPlaying()) dispatch(setIsSongPlaying(false))
                else playSongFromPlaylist(index)
                break
        }
    }

    const onPlayFromPhone = () => {
        if (!isMobile) return
        onClickPlay()
    }

    const shouldShowImage = () => {
        return !(currPlayingIdx !== index && type === 'queue' && isMobile)
    }

    return (<>
        <div className={`top-songs-results flex align-center`} onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} onClick={onPlayFromPhone}>
            <div className="top-song flex align-center">
                {!isMobile && index !== undefined && <div className="index-display">

                    {isHover && (<button className={`play-pause-btn ${isThisSongPlaying() ? 'pause' : 'play'}`}
                        onClick={onClickPlay}>{isThisSongPlaying() ? <GiPauseButton /> : <BiPlay />}</button>)}

                    {!isThisSongPlaying() && !isHover && <p>{index + 1}</p>}

                    {isThisSongPlaying() && !isHover && <div className="volume-gif">
                        <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt=""
                        />
                    </div>}
                </div>}

                {shouldShowImage() && <div className="img-container">

                    <img src={song.image} alt="" />

                    {(type === 'search-results' || type === 'playlist-details-search') && (
                        <button className="photo-play" onClick={onClickPlay}>
                            <span>{isThisSongPlaying() ? <GiPauseButton /> : <BiPlay />}</span>
                        </button>)}
                </div>}

                <div className="song-description">
                    <div className="song-title">
                        {(type === 'queue') ? (
                            <h5 className={`${index === currPlayingIdx ? 'playing' : ''}`}>{song.title}</h5>) : (
                            <h5 className={`${isCurrSong ? 'playing' : ''}`}>{song.title}</h5>)}
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
                {!isMobile &&
                    <p>{utilService.millisToMinutesAndSeconds(song.duration)}</p>}
                <button onClick={(event) => { toggleModal(event, song) }} className="actions-btn">
                    <span><HiOutlineDotsHorizontal /></span>
                </button>
            </div>}
        </div>
    </>)
}