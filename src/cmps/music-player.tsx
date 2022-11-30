import { Slider } from '@mui/material';
import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Song } from '../interfaces/song';
import { utilService } from '../services/util.service';
import { reorderSongsList, setIsSongPlaying, setPlayingIdx, setPlaylist, } from '../store/music-player/music-player.reducer';
import { useAppDispatch, useAppSelector } from '../store/store.hooks';
import { timeSliderOptions, volumeSliderOptions } from '../helpers/slider-component-config';
import { BiPlay, BiVolumeLow, BiVolumeFull, BiVolume, BiShuffle } from 'react-icons/bi'
import { GiPauseButton } from 'react-icons/gi'
import { TiThListOutline } from 'react-icons/ti'
import { MdSkipNext, MdSkipPrevious, MdForward10, MdReplay10 } from 'react-icons/md'
import { useNavigate } from 'react-router-dom';
import { cachingService } from '../services/music-player-caching.service';
import { LikeButton } from './like-button';
import { BsChevronDown } from 'react-icons/bs';
import { FiRepeat } from 'react-icons/fi';
import { useSwipeable } from 'react-swipeable';

export const MusicPlayer = () => {
    const songIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const playlist = useAppSelector(state => state.musicPlayer.currPlaylist)
    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const screenWidth = useAppSelector(state => state.helper.screenWidth)
    const currSong = playlist?.songs[songIdx]
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const playerRef = useRef<any>()
    const durationIntervalId = useRef<number>()

    const playingTimeFromCache = useRef<number | null>()
    const [isOpen, setIsOpen] = useState(false)


    useEffect(() => {
        const idx = cachingService.getPlayingIdx()
        const playlist = cachingService.getPlaylist()
        const volume = cachingService.getCurrentVolume()
        if (volume !== undefined && volume !== null) onVolumeChange(volume)
        if (typeof idx === 'number' && playlist) {
            dispatch(setPlaylist(playlist))
            dispatch(setPlayingIdx(idx))
            const playingTime = cachingService.getPlayingTime()
            playingTimeFromCache.current = playingTime
        }
    }, [])

    useEffect(() => {
        if (isSongPlaying) {
            playerRef.current?.playVideo()
            window.clearInterval(durationIntervalId.current)
            durationInterval()
        } else {
            playerRef.current?.pauseVideo()
            window.clearInterval(durationIntervalId.current)
        }
        // should do a useeffect on the currPlayingidx if it changes but the song is'nt changing i should restart
    }, [isSongPlaying])

    const [songTimer, setSongTimer] = useState(0)
    const prevVolume = useRef(50)
    const [volume, setVolume] = useState(50)
    const [isShuffled, setIsShuffled] = useState(false)
    const [isLoopingEnabled, setIsLoopingEnabled] = useState(false)
    const unShuffledSongs = useRef<Song[] | null>(null)

    const onPlayerReady: YouTubeProps['onReady'] = (ev) => {
        playerRef.current = ev.target
        if (playingTimeFromCache.current) {
            console.log('gettin here')
            setSongTimer(playingTimeFromCache.current)
            playerRef.current.seekTo(playingTimeFromCache.current / 1000)
            playingTimeFromCache.current = null
            pauseVideo()
        } else {
            onVolumeChange(playerRef.current.playerInfo.volume)
            setSongTimer(0)
            startVideo()
        }

    }

    const durationInterval = () => {
        durationIntervalId.current = window.setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime() + 1 >= currSong.duration / 1000) {
                setSongTimer(0)
                if (!isLoopingEnabled) {
                    dispatch(setPlayingIdx(songIdx + 1))
                    window.clearInterval(durationIntervalId.current)
                } else startVideo()
            } else {
                const currTime = playerRef.current.getCurrentTime() * 1000
                setSongTimer(currTime)
                cachingService.savePlayingTime(currTime)
            }
        }, 100)
    }

    const onStopPropagation = (ev: React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation()
        // setIsOpen(false)
    }

    const onClickPlay = (ev: React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation()
        // setIsOpen(false)
        if (isSongPlaying) pauseVideo()
        else startVideo()
    }

    const startVideo = () => {
        playerRef.current.playVideo()
        window.clearInterval(durationIntervalId.current)
        durationInterval()
        dispatch(setIsSongPlaying(true))
    }

    const pauseVideo = () => {
        playerRef.current.pauseVideo()
        window.clearInterval(durationIntervalId.current)
        dispatch(setIsSongPlaying(false))
    }

    const toggleMute = () => {
        if (volume) mute()
        else unMute()
    }


    const unMute = () => {
        onVolumeChange(prevVolume.current)
    }

    const mute = () => {
        prevVolume.current = volume
        onVolumeChange(0)
    }

    const onVolumeChange = (newVolume: number) => {
        prevVolume.current = volume
        if (playerRef.current) playerRef.current.setVolume(newVolume)
        setVolume(newVolume)
        cachingService.saveCurrentVolume(newVolume)
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
            startVideo()
        }

        console.log(songTimer)
        setSongTimer(time * 1000)
        playerRef.current.pauseVideo()
        window.clearInterval(durationIntervalId.current)
        window.clearTimeout(timeBarDebounceId.current)
        timeBarDebounceId.current = window.setTimeout(later, 1000)
    }

    const toggleSongsShuffle = () => {
        if (isShuffled) unShuffleSongs()
        else shuffleSongs()
    }


    const shuffleSongs = () => {
        unShuffledSongs.current = playlist.songs
        const beforePlayingIdx = playlist.songs.slice(0, songIdx + 1)
        const afterPlayingIdx = utilService.shuffle(playlist.songs.slice(songIdx + 1))
        setIsShuffled(true)
        dispatch(reorderSongsList(beforePlayingIdx.concat(afterPlayingIdx)))
    }

    const unShuffleSongs = () => {
        setIsShuffled(false)
        if (unShuffledSongs.current) dispatch(reorderSongsList(unShuffledSongs.current))
    }

    const onIndexIncrement = () => {
        pauseVideo()
        playerRef.current = null
        dispatch(setPlayingIdx(songIdx + 1))
    }
    const onIndexDecrement = () => {
        pauseVideo()
        playerRef.current = null
        dispatch(setPlayingIdx(songIdx - 1))
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
    });

    return (
        <>
            {currSong && <YouTube className="iframe-container" videoId={currSong.videoId} opts={opts} onReady={onPlayerReady} />}
            {(screenWidth < 770 && !isOpen) ? (
                <footer onClick={() => { setIsOpen(true) }} className="music-player mobile">
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
                            <button title={isSongPlaying ? 'Pause' : 'Play'} className={`play-pause-btn ${isSongPlaying ? 'pause' : 'play'}`} onClick={onClickPlay}>{isSongPlaying ? <GiPauseButton /> : <BiPlay />}</button>
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
                : (<footer className={`${(isOpen && screenWidth < 770) ? 'full' : ''} music-player`}>
                    {isOpen && screenWidth < 770 && <button className="close-modal-btn" onClick={() => { setIsOpen(false) }}><BsChevronDown /> </button>}
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
                            {/* <button title="Return 10" onClick={() => seekTo(songTimer / 1000 - 10)} ><MdReplay10 /></button> */}
                            <button title="Previous" onClick={onIndexDecrement} ><MdSkipPrevious /></button>
                            <button title={isSongPlaying ? 'Pause' : 'Play'} className={`play-pause-btn ${isSongPlaying ? 'pause' : 'play'}`} onClick={onClickPlay}>{isSongPlaying ? <GiPauseButton /> : <BiPlay />}</button>
                            <button title="Next" onClick={onIndexIncrement} ><MdSkipNext /></button>
                            {/* <button title="Skip 10" onClick={() => seekTo(songTimer / 1000 + 10)}><MdForward10 /></button> */}
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
                            min={0} max={100} value={volume} onChange={(_, value) => onVolumeChange(value as number)}
                            sx={volumeSliderOptions}
                        />
                    </section>
                </footer>)}
        </>
    )
}

