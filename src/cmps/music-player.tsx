import { BiPlay, BiVolumeLow, BiVolumeFull, BiVolume, BiShuffle } from 'react-icons/bi'
import { MdSkipNext, MdSkipPrevious, MdForward10, MdReplay10 } from 'react-icons/md'
import { GiPauseButton } from 'react-icons/gi'
import { TiThListOutline } from 'react-icons/ti'
import { BsChevronDown } from 'react-icons/bs';
import { FiRepeat } from 'react-icons/fi';
import { useSwipeable } from 'react-swipeable';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect, LegacyRef, useLayoutEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { reorderSongsList, setIsSongPlaying, setPlayingIdx, setPlaylist } from '../store/music-player/music-player.reducer';
import { useAppDispatch, useAppSelector } from '../store/store.hooks';
import { timeSliderOptions, volumeSliderOptions } from '../helpers/slider-component-config';
import { utilService } from '../services/util.service';
import { Song } from '../interfaces/song';
import { cachingService } from '../services/music-player-caching.service';
import { LikeButton } from './like-button';
import { Slider } from '@mui/material';
import { useIsMobile } from '../hooks/useIsMobile';

export const MusicPlayer = () => {

    const currPlayingIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const queueSongs = useAppSelector(state => state.musicPlayer.songs)
    const isSongPlaying = useAppSelector(state => state.musicPlayer.isSongPlaying)
    const { isMobile, screenWidth } = useIsMobile()
    const currSong = queueSongs[currPlayingIdx]
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const playerRef = useRef<any>()
    const durationIntervalId = useRef<number>()
    const playingTimeFromCache = useRef<number | null>()
    const [isMobileFullScreen, setIsMobileFullScreen] = useState(false)




    useEffect(() => {
        // at the componentDidMount stage checks if there are
        //  previous playlist,volume,playing time and playing index cached if so takes them 
        // and load them to the store for the app to use.
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
        // listens to changes in playing status from across the app,and play or pause the video.
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
    const [isLoopingEnabled, setIsLoopingEnabled] = useState(false)

    const onPlayerReady: YouTubeProps['onReady'] = (ev) => {
        // the function that catches the player object from the youtube component
        // and starts the control over it.
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
        // the interval that synchronize the time of the current song
        //  from the youtube component,and the local state.
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

    const { isShuffled, toggleSongsShuffle } = useSongsShuffle(queueSongs, currPlayingIdx)

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


    const { songNameP, namesContainerRef, songNamePos } = useTextRollup(screenWidth, currSong)
    // [songNameP, namesContainerRef, songNamePos]


    return (
        <>
            {currSong && <YouTube className="iframe-container" videoId={currSong.videoId} opts={opts} onReady={onPlayerReady} />}
            {(isMobile && !isMobileFullScreen) ? (
                <footer onClick={() => { setIsMobileFullScreen(true) }} className="music-player mobile">
                    {currSong && <>
                        <section className="mobile-right">
                            <img className="song-image" src={currSong.image} alt="" />
                            <div ref={namesContainerRef} className="names-container">
                                <p style={{ left: `${songNamePos}px` }} ref={songNameP} className="song-name">{currSong.title}</p>
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

                                <div ref={namesContainerRef} className="names-container">
                                    <p style={{ left: `${songNamePos}px` }} ref={songNameP} className="song-name">{currSong.title}</p>
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
                        <button onClick={() => {
                            if (location.pathname.includes('queue')) navigate(-1)
                            else navigate('/queue')
                        }} className="queue-btn"><TiThListOutline /></button>
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


const useSongsShuffle = (songs: Song[], currPlayingIdx: number) => {
    const [isShuffled, setIsShuffled] = useState(false)
    const unShuffledSongs = useRef<Song[] | null>(null)
    const dispatch = useAppDispatch()
    const playlistId = useAppSelector(state => state.musicPlayer.playlistId)

    const toggleSongsShuffle = () => {
        if (isShuffled) unShuffleSongs()
        else shuffleSongs()
    }
    useEffect(() => {
        if (isShuffled && playlistId) {
            shuffleSongs()
            //:TODO indexshuffling before the shuffle song activation
        } else {
            setIsShuffled(false)
        }
    }, [playlistId])

    const shuffleSongs = () => {
        unShuffledSongs.current = songs
        const beforePlayingIdx = songs.slice(0, currPlayingIdx + 1)
        const afterPlayingIdx = utilService.shuffle(songs.slice(currPlayingIdx + 1))
        setIsShuffled(true)
        dispatch(reorderSongsList(beforePlayingIdx.concat(afterPlayingIdx)))
    }

    const unShuffleSongs = () => {
        setIsShuffled(false)
        if (unShuffledSongs.current) dispatch(reorderSongsList(unShuffledSongs.current))
    }

    return { isShuffled, toggleSongsShuffle }
}

const useTextRollup = (screenWidth: number, currSong: Song) => {
    // makes that if the text is too long for the container it will spin around back and forth.
    const songNameP = useRef<HTMLParagraphElement>(null)
    const namesContainerRef = useRef<HTMLDivElement>(null)
    const nameMovementIntervalId = useRef<number>(1)
    const [songNamePos, setSongNamePos] = useState(0)
    useEffect(() => {
        setSongNamePos(0)
        window.clearInterval(nameMovementIntervalId.current)
        if (namesContainerRef?.current?.clientWidth && songNameP?.current?.clientWidth) {
            const safetyMeasure = 10
            const travelUnit = 2
            const distance = namesContainerRef.current.clientWidth - songNameP.current.clientWidth - safetyMeasure
            if (distance < -safetyMeasure) {
                let direction = 'backward'
                nameMovementIntervalId.current = window.setInterval(() => {
                    setSongNamePos((prev) => {
                        if (direction === 'backward') {
                            if (prev <= distance) {
                                direction = 'forward'
                                return prev + travelUnit
                            }
                            return prev - travelUnit
                        } else {
                            if (prev >= safetyMeasure) {
                                direction = 'backward'
                                return prev - travelUnit
                            }
                            return prev + travelUnit
                        }
                    })
                }, 250)
            }

        }
        return () => {
            window.clearInterval(nameMovementIntervalId.current)
        }
    }, [currSong, screenWidth])

    return { songNameP, namesContainerRef, songNamePos }
}