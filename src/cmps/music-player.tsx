import { Slider } from '@mui/material';
import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Song } from '../interfaces/song';
import { utilService } from '../services/util.service';
import { setSong } from '../store/music-player/music-player.reducer';
import { useAppDispatch, useAppSelector } from '../store/store.hooks';
import { timeSliderOptions, volumeSliderOptions } from '../helpers/slider-component-config';
import { BiPlay, BiVolumeLow, BiVolumeFull, BiVolume } from 'react-icons/bi'
import { GiPauseButton } from 'react-icons/gi'
import { MdSkipNext, MdSkipPrevious, MdForward10, MdReplay10 } from 'react-icons/md'

export const MusicPlayer = () => {
    const currSong = useAppSelector(state => state.musicPlayer.currSong)
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
            if (currSong && songTimer >= currSong.duration) {
                window.clearInterval(durationIntervalId.current)
                //allso should update the currSong,maybe we should to the currSong 
                //send an update and try to +1 for the index on the current playlist and make currSong 
                // be a computed style function make the current playlist and current songIdx
                //this way if it's only one song then just put it in the index 0 if it will try to go up
                // it wont be able
            }
            setSongTimer(playerRef.current.getCurrentTime() * 1000)
        }, 100)
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

    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
        }
    }
    const changeSong = () => {
        const song = {
            description: 'Official Music Video for Smells Like Teen Spirit performed by Nirvana. Nevermind (30th Anniversary Edition) is available now: ...',
            duration: 198000,
            id: 'PAK5blgfKWM',
            image: 'https://i.ytimg.com/vi/PAK5blgfKWM/default.jpg',
            publishTime: '2009-06-16T22:14:25Z',
            title: 'The Doors - Alabama Song'

        }

        dispatch(setSong(song as Song))

    }
    const changeSong2 = () => {
        const song = {
            description: 'Official Music Video for Smells Like Teen Spirit performed by Nirvana. Nevermind (30th Anniversary Edition) is available now: ...',
            duration: 198000,
            id: '44oCg-G7bQ4',
            image: 'https://i.ytimg.com/vi/PAK5blgfKWM/default.jpg',
            publishTime: '2009-06-16T22:14:25Z',
            title: 'The Doors - Alabama Song'

        }
        dispatch(setSong(song as Song))
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
                        <button><MdSkipPrevious /></button>
                        <button className={`play-pause-btn ${isSongPlaying ? 'pause' : 'play'}`} onClick={onClickPlay}>{isSongPlaying ? <GiPauseButton /> : <BiPlay />}</button>
                        <button><MdSkipNext /></button>
                        <button onClick={() => seekTo(songTimer / 1000 + 10)}><MdForward10 /></button>

                    </section>
                    <section className="time-container">
                        {currSong && <p>{utilService.millisToMinutesAndSeconds(songTimer)}</p>}
                        <Slider
                            aria-label="time-indicator"
                            size="small"
                            value={songTimer / 1000}
                            min={0}
                            step={1}
                            disabled={currSong ? false : true}
                            max={(currSong) ? currSong.duration / 1000 : 100}
                            onChange={(_, value) => onChangeTime(value as number)}
                            sx={timeSliderOptions}
                        />
                        {currSong && <p>{utilService.millisToMinutesAndSeconds(currSong.duration)}</p>}
                    </section>

                </div>
                <section className="right-section">
                    <button className="volume-btn" onClick={toggleMute} >{getVolumeIcon()}</button>
                    <Slider
                        min={0} max={100} value={volume} onChange={(_, value) => onVolumeChange(value as number)}
                        sx={volumeSliderOptions}
                    />
                </section>

                <button className="dev-button one" onClick={changeSong}>Change Song </button>
                <button className="dev-button two" onClick={changeSong2}>Change Song 2</button>
            </footer>
        </>
    )
}

