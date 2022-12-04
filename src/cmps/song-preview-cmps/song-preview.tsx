import { useState } from "react"

import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { PlaylistSong, Song } from "../../interfaces/song"
import { utilService } from "../../services/util.service"
import { addToPlaylist, removeSong, replacePlaylist, setIsSongPlaying, setPlayingIdx } from "../../store/music-player/music-player.reducer"
import { useAppDispatch, useAppSelector } from "../../store/store.hooks"
import { LikeButton } from "../like-button"
import { SongPreviewIndex } from "./song-preview-index"
import { SongPreviewImage } from "./song-preview-image"
import { SongPreviewDesc } from "./song-preview-desc"

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
    const isThisSongPlaying = (type === 'queue') ?
        isSongPlaying && currPlayingIdx === index &&
        isCurrSong : isSongPlaying && isCurrSong


    const onClickPlay = () => {
        switch (type) {
            case 'queue':
                if (isThisSongPlaying) dispatch(setIsSongPlaying(false))
                else if (currPlayingIdx === index && !isSongPlaying) dispatch(setIsSongPlaying(true))
                else if (index !== undefined) dispatch(setPlayingIdx(index))
                break
            case 'search-results':
                if (!isSongPlaying && isCurrSong) dispatch(setIsSongPlaying(true))
                else if (isThisSongPlaying) dispatch(setIsSongPlaying(false))
                else dispatch(replacePlaylist(song))
                break
            case 'playlist-details-search':
            case 'playlist-details':
                if (!isSongPlaying && isCurrSong) dispatch(setIsSongPlaying(true))
                else if (isThisSongPlaying) dispatch(setIsSongPlaying(false))
                else playSongFromPlaylist(index)
                break
        }
    }

    const onPlayFromPhone = () => {
        if (!isMobile) return
        onClickPlay()
    }

    const isImageDisplayed = () => {
        return !(currPlayingIdx !== index && type === 'queue' && isMobile)
    }
    return (<>
        <div className={`top-songs-results flex align-center`} onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} onClick={onPlayFromPhone}>
            <div className="top-song flex align-center">
                {!isMobile && index !== undefined && <SongPreviewIndex
                    onClickPlay={onClickPlay} index={index}
                    isThisSongPlaying={isThisSongPlaying} isHover={isHover} />}

                {isImageDisplayed() && <SongPreviewImage
                    image={song.image} onClickPlay={onClickPlay}
                    type={type} isThisSongPlaying={isThisSongPlaying} />}

                <SongPreviewDesc artist={song.artist}
                    isThisSongPlaying={isThisSongPlaying} title={song.title} />
            </div>
            {/* the topsong part is the main section of the song preview and the constant one */}
            {/* turn to two components,one for all type that arent playlist details dearch and for former */}
            {type === 'playlist-details-search' &&
                <div className="add-to-playlist-btn"><button onClick={() => onAddToPlaylist(song)}>Add</button></div>}
            {type === 'playlist-details' && <div className="added-at">
                {song?.addedAt && utilService.getDetailedTime(+song.addedAt)}
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