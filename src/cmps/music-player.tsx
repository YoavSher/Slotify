import { BiPlay, BiVolumeLow, BiVolumeFull, BiVolume, BiShuffle } from 'react-icons/bi'
import { MdSkipNext, MdSkipPrevious, MdForward10, MdReplay10 } from 'react-icons/md'
import { GiPauseButton } from 'react-icons/gi'
import { TiThListOutline } from 'react-icons/ti'
import { BsChevronDown } from 'react-icons/bs';
import { FiRepeat } from 'react-icons/fi';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { reorderSongsList, setIsSongPlaying, setPlayingIdx, setPlaylist } from '../store/music-player/music-player.reducer';
import { useAppDispatch, useAppSelector } from '../store/store.hooks';
import { timeSliderOptions, volumeSliderOptions } from '../helpers/slider-component-config';
import { utilService } from '../services/util.service';
import { Song } from '../interfaces/song';
import { cachingService } from '../services/music-player-caching.service';
import { LikeButton } from './like-button';
import { Slider } from '@mui/material';

export const MusicPlayer = () => {

    const currPlayingIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const queueSongs = useAppSelector(state => state.musicPlayer.songs)
    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const currSong = queueSongs[currPlayingIdx]
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const playerRef = useRef<any>()
    const durationIntervalId = useRef<number>()
    const playingTimeFromCache = useRef<number | null>()
    const [isMobileFullScreen, setIsMobileFullScreen] = useState(false)

    useEffect(() => {
        const previousPlaylistInfo = cachingService.getPlaylist()
        const volume = cachingService.getCurrentVolume()
        if (volume || volume === 0) onVolumeChange(volume)
        if (previousPlaylistInfo) {
            const idx = cachingService.getPlayingIdx()
            dispatch(setPlaylist(previousPlaylistInfo))
            dispatch(setPlayingIdx(idx))
            const playingTime = cachingService.getPlayingTime()
            playingTimeFromCache.current = playingTime
        }
    }, [])

    useEffect(() => {
        window.clearInterval(durationIntervalId.current)
        if (isSongPlaying) {
            playerRef.current?.playVideo()
            durationInterval()
        } else {
            playerRef.current?.pauseVideo()
        }
        return () => {
            window.clearInterval(durationIntervalId.current)
        }
    }, [isSongPlaying])

    const [songTimer, setSongTimer] = useState(0)

    const [volume, setVolume] = useState(50)
    const [isShuffled, setIsShuffled] = useState(false)
    const [isLoopingEnabled, setIsLoopingEnabled] = useState(false)
    const unShuffledSongs = useRef<Song[] | null>(null)

    const onPlayerReady: YouTubeProps['onReady'] = (ev) => {
        playerRef.current = ev.target
        if (playingTimeFromCache.current) {
            setSongTimer(playingTimeFromCache.current)
            playerRef.current.seekTo(playingTimeFromCache.current / 1000)
            playingTimeFromCache.current = null
            pauseSong()
        } else {
            onVolumeChange(playerRef.current.playerInfo.volume)
            setSongTimer(0)
            playSong()
        }

    }

    const durationInterval = () => {
        durationIntervalId.current = window.setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime() + 1 >= currSong.duration / 1000) {
                setSongTimer(0)
                if (!isLoopingEnabled) {
                    dispatch(setPlayingIdx(currPlayingIdx + 1))
                    window.clearInterval(durationIntervalId.current)
                    pauseSong()
                } else playSong()
            } else {
                const currTime = playerRef.current.getCurrentTime() * 1000
                setSongTimer(currTime)
                cachingService.savePlayingTime(currTime)
            }
        }, 100)
    }

    const onClickPlay = (ev: React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation()
        dispatch(setIsSongPlaying(!isSongPlaying))
    }

    const playSong = () => {
        dispatch(setIsSongPlaying(true))
        playerRef.current?.playVideo()
        window.clearInterval(durationIntervalId.current)
        durationInterval()
    }

    const pauseSong = () => {
        window.clearInterval(durationIntervalId.current)
        dispatch(setIsSongPlaying(false))
        playerRef.current?.pauseVideo()
    }

    const onVolumeChange = (newVolume: number) => {
        playerRef.current?.setVolume(newVolume)
        setVolume(newVolume)
        cachingService.saveCurrentVolume(newVolume)
    }
    const prevVolume = useRef(50)

    const toggleMute = () => {
        if (volume) {
            prevVolume.current = volume
            onVolumeChange(0)
        } else onVolumeChange(prevVolume.current)
    }

    const seekTo = (timeInSeconds: number) => {
        if (playerRef.current.playerInfo.duration <= timeInSeconds) {
            onIndexIncrement()
        } else playerRef.current.seekTo(timeInSeconds)
    }

    const timeBarDebounceId = useRef<number>()

    const onChangeTime = (time: number) => {
        const later = () => {
            window.clearTimeout(timeBarDebounceId.current)
            seekTo(time)
            if (isSongPlaying) playSong()

        }
        setSongTimer(time * 1000)
        window.clearInterval(durationIntervalId.current)
        window.clearTimeout(timeBarDebounceId.current)
        timeBarDebounceId.current = window.setTimeout(later, 1000)
    }

    const toggleSongsShuffle = () => {
        if (isShuffled) unShuffleSongs()
        else shuffleSongs()
    }

    const shuffleSongs = () => {
        unShuffledSongs.current = queueSongs
        const beforePlayingIdx = queueSongs.slice(0, currPlayingIdx + 1)
        const afterPlayingIdx = utilService.shuffle(queueSongs.slice(currPlayingIdx + 1))
        setIsShuffled(true)
        dispatch(reorderSongsList(beforePlayingIdx.concat(afterPlayingIdx)))
    }

    const unShuffleSongs = () => {
        setIsShuffled(false)
        if (unShuffledSongs.current) dispatch(reorderSongsList(unShuffledSongs.current))
    }

    const onIndexIncrement = () => {
        onIndexChange(1)
    }

    const onIndexDecrement = () => {
        onIndexChange(-1)
    }

    const onIndexChange = (num: number) => {
        pauseSong()
        playerRef.current = null
        dispatch(setPlayingIdx(currPlayingIdx + num))
    }

    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
        }
    }

    const getVolumeIcon = () => {
        switch (true) {
            case (volume === 0):
                return <BiVolume />
            case (volume < 60):
                return <BiVolumeLow />
            case (volume >= 60):
                return <BiVolumeFull />

        }
    }
    const getFullDuration = () => {
        return playerRef.current.playerInfo.duration * 1000 || 0
    }

    const handlers = useSwipeable({
        onSwipedRight: () => { onIndexDecrement() },
        onSwipedLeft: () => { onIndexIncrement() },
    })

    const isMobile = screenWidth <= 770

    return (
        <>
            {currSong && <YouTube className="iframe-container" videoId={currSong.videoId} opts={opts} onReady={onPlayerReady} />}
            {(isMobile && !isMobileFullScreen) ? (
                <footer onClick={() => { setIsMobileFullScreen(true) }} className="music-player mobile">
                    {currSong && <>
                        <section className="mobile-right">
                            <img className="song-image" src={currSong.image} alt="" />
                            <div className="names-container">
                                <p className="song-name">{currSong.title}</p>
                                <p className="artist-name">{currSong.artist}</p>
                            </div>
                        </section>
                        <section className="mobile-left" >
                            <LikeButton song={currSong} />
                            <button title={isSongPlaying ? 'Pause' : 'Play'}
                                className={`play-pause-btn ${isSongPlaying ? 'pause' : 'play'}`}
                                onClick={onClickPlay}>{isSongPlaying ? <GiPauseButton /> : <BiPlay />}
                            </button>
                        </section>
                    </>}
                    <section className="time-container">
                        <Slider
                            aria-label="time-indicator"
                            size="small"
                            value={songTimer / 1000 | 0}
                            min={0}
                            step={1}
                            disabled={currSong ? false : true}
                            max={(currSong) ? currSong.duration / 1000 : 100}
                            sx={timeSliderOptions}
                        />
                    </section>
                </footer>)
                : (<footer className={`${(isMobileFullScreen && isMobile) ? 'full' : ''} music-player`}>
                    {isMobileFullScreen && isMobile && <button className="close-modal-btn"
                        onClick={() => { setIsMobileFullScreen(false) }}><BsChevronDown /> </button>}
                    <section {...handlers} className="left-section">
                        {currSong && <>
                            <img className="song-image" src={currSong.image} alt="" />
                            <section className="below-image">

                                <div className="names-container">
                                    <p className="song-name">{currSong.title}</p>
                                    <p className="artist-name">{currSong.artist}</p>
                                </div>
                                <LikeButton song={currSong} />
                            </section>
                        </>}
                    </section>

                    <div className="main-player">
                        <section className="buttons-container">
                            <button title="Shuffle" onClick={toggleSongsShuffle} className={`shuffle-btn ${(isShuffled) ? 'shuffled' : ''}`} ><BiShuffle /></button>
                            {screenWidth > 900 && <button title="Return 10" onClick={() => seekTo(songTimer / 1000 - 10)} ><MdReplay10 /></button>}
                            <button title="Previous" onClick={onIndexDecrement} ><MdSkipPrevious /></button>
                            <button title={isSongPlaying ? 'Pause' : 'Play'} className={`play-pause-btn ${isSongPlaying ? 'pause' : 'play'}`} onClick={onClickPlay}>{isSongPlaying ? <GiPauseButton /> : <BiPlay />}</button>
                            <button title="Next" onClick={onIndexIncrement} ><MdSkipNext /></button>
                            {screenWidth > 900 && <button title="Skip 10" onClick={() => seekTo(songTimer / 1000 + 10)}><MdForward10 /></button>}
                            <button onClick={() => setIsLoopingEnabled(prev => !prev)} className={`repeat-btn ${(isLoopingEnabled) ? 'repeat' : ''}`} title="Repeat"><FiRepeat /></button>
                        </section>
                        <section className="time-container">
                            {playerRef.current && <p>{utilService.millisToMinutesAndSeconds(songTimer)}</p>}
                            <Slider
                                aria-label="time-indicator"
                                size="small"
                                value={songTimer / 1000 | 0}
                                min={0}
                                step={1}
                                disabled={currSong ? false : true}
                                max={(currSong) ? currSong.duration / 1000 : 100}
                                onChange={(_, value) => onChangeTime(value as number)}
                                sx={timeSliderOptions}
                            />
                            {playerRef.current && <p>{utilService.millisToMinutesAndSeconds(getFullDuration())}</p>}
                        </section>

                    </div>
                    <section className="right-section">
                        <button onClick={() => navigate('/queue')} className="queue-btn"><TiThListOutline /></button>
                        <button className="volume-btn" onClick={toggleMute} >{getVolumeIcon()}</button>
                        <Slider
                            min={0}
                            max={100}
                            value={volume} onChange={(_, value) => onVolumeChange(value as number)}
                            sx={volumeSliderOptions}
                        />
                    </section>
                </footer>)}
        </>
    )
}

