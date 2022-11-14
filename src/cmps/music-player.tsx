import { Slider } from '@mui/material';
import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Song } from '../interfaces/song';
import { utilService } from '../services/util.service';
import { decrementPlayingIdx, incrementPlayingIdx, } from '../store/music-player/music-player.reducer';
import { useAppDispatch, useAppSelector } from '../store/store.hooks';
import { timeSliderOptions, volumeSliderOptions } from '../helpers/slider-component-config';
import { BiPlay, BiVolumeLow, BiVolumeFull, BiVolume } from 'react-icons/bi'
import { GiPauseButton } from 'react-icons/gi'
import { TiThListOutline } from 'react-icons/ti'
import { MdSkipNext, MdSkipPrevious, MdForward10, MdReplay10 } from 'react-icons/md'

export const MusicPlayer = () => {
    const songIdx = useAppSelector(state => state.musicPlayer.currPlayingIdx)
    const playlist = useAppSelector(state => state.musicPlayer.currPlaylist)
    const currSong = playlist?.songs[songIdx]
    const dispatch = useAppDispatch()

    const playerRef = useRef<any>()
    const durationIntervalId = useRef<number>()

    const [isSongPlaying, setIsSongPlaying] = useState(false)
    const [songTimer, setSongTimer] = useState(0)
    const prevVolume = useRef(50)
    const [volume, setVolume] = useState(50)

    const onPlayerReady: YouTubeProps['onReady'] = (ev) => {
        playerRef.current = ev.target
        setVolume(playerRef.current.playerInfo.volume)
        setSongTimer(0)
        window.clearInterval(durationIntervalId.current)
        startVideo()
    }

    const durationInterval = () => {
        durationIntervalId.current = window.setInterval(() => {
            if (currSong && playerRef.current.getCurrentTime() >= playerRef.current.playerInfo.duration) {
                playerRef.current = null
                onIndexIncrement()
                clearInterval()
                setSongTimer(0)
            } else {
                setSongTimer(playerRef.current.getCurrentTime() * 1000)
            }
        }, 100)
    }

    const clearInterval = () => {
        window.clearInterval(durationIntervalId.current)
    }

    const onClickPlay = () => {
        if (isSongPlaying) pauseVideo()
        else startVideo()
    }

    const startVideo = () => {
        playerRef.current.playVideo()
        setIsSongPlaying(true)
        durationInterval()
    }

    const pauseVideo = () => {
        playerRef.current.pauseVideo()
        setIsSongPlaying(false)
        window.clearInterval(durationIntervalId.current)
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

    const onVolumeChange = (number: number) => {
        prevVolume.current = volume
        if (playerRef.current) playerRef.current.setVolume(number)
        setVolume(number)

    }

    const seekTo = (timeInSeconds: number) => {
        playerRef.current.seekTo(timeInSeconds)
    }

    const timeBarDebounceId = useRef<number>()

    const onChangeTime = (time: number) => {
        const later = () => {
            window.clearTimeout(timeBarDebounceId.current)
            seekTo(time)
            startVideo()
        }

        setSongTimer(time * 1000)
        pauseVideo()
        window.clearTimeout(timeBarDebounceId.current)
        timeBarDebounceId.current = window.setTimeout(later, 1000)
    }

    const onIndexIncrement = () => {
        console.log('ingrementing')
        dispatch(incrementPlayingIdx())
    }
    const onIndexDecrement = () => {
        dispatch(decrementPlayingIdx())
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


    return (
        <>
            <footer className="music-player">
                <section className="left-section">
                    {currSong && <>
                        <YouTube className="iframe-container" videoId={currSong.id} opts={opts} onReady={onPlayerReady} />
                        <img className="song-image" src={currSong.image} alt="" />
                        <div className="names-container">
                            <p className="song-name">{currSong.title}</p>
                        </div>

                    </>}
                </section>

                <div className="main-player">
                    <section className="buttons-container">
                        <button onClick={() => seekTo(songTimer / 1000 - 10)} ><MdReplay10 /></button>
                        <button onClick={onIndexDecrement} ><MdSkipPrevious /></button>
                        <button className={`play-pause-btn ${isSongPlaying ? 'pause' : 'play'}`} onClick={onClickPlay}>{isSongPlaying ? <GiPauseButton /> : <BiPlay />}</button>
                        <button onClick={onIndexIncrement} ><MdSkipNext /></button>
                        <button onClick={() => seekTo(songTimer / 1000 + 10)}><MdForward10 /></button>

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
                    <button className="queue-btn"><TiThListOutline /></button>
                    <button className="volume-btn" onClick={toggleMute} >{getVolumeIcon()}</button>
                    <Slider
                        min={0} max={100} value={volume} onChange={(_, value) => onVolumeChange(value as number)}
                        sx={volumeSliderOptions}
                    />
                </section>
            </footer>
        </>
    )
}

