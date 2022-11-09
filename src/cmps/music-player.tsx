import React, { ChangeEvent, useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Song } from '../interfaces/song';
import { utilService } from '../services/util.service';
import { setSong } from '../store/music-player/music-player.reducer';
import { useAppDispatch, useAppSelector } from '../store/store.hooks';

export const MusicPlayer = () => {
    const currSong = useAppSelector(state => state.musicPlayer.currSong)
    const dispatch = useAppDispatch()

    const playerRef = useRef<any>()
    const durationIntervalId = useRef<number>()
    const [isSongPlaying, setIsSongPlaying] = useState(false)
    const [songTimer, setSongTimer] = useState(0)
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target
        console.log(event.target.getDuration()) // we can get duration from here is in seconds needs to mulyiply it
        console.log(event.target.getCurrentTime()) // allso in seconds 
        console.log(event.target.setVolume(50)) // from 1 to 100 with a meter bar
        // getCurrentTime,getDuration,unmute,setVolume
        // startVideo()
        pauseVideo()

    }

    const durationInterval = () => {
        durationIntervalId.current = window.setInterval(() => {
            if (currSong && songTimer >= currSong.duration) {
                window.clearInterval(durationIntervalId.current)
            }
            setSongTimer(playerRef.current.getCurrentTime() * 1000)
        }, 500)
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
    const onVolumeChange = (ev: ChangeEvent<HTMLInputElement>) => {
        playerRef.current.setVolume(ev.target.value)

    }
    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    }
    const changeSong = () => {
        const song1 = {
            description: 'Official Music Video for Smells Like Teen Spirit performed by Nirvana. Nevermind (30th Anniversary Edition) is available now: ...',
            duration: 198000,
            id: 'PAK5blgfKWM',
            image: 'https://i.ytimg.com/vi/PAK5blgfKWM/default.jpg',
            publishTime: '2009-06-16T22:14:25Z',
            title: 'The Doors - Alabama Song'

        }
        const song2 = {
            description: 'Official Music Video for Smells Like Teen Spirit performed by Nirvana. Nevermind (30th Anniversary Edition) is available now: ...',
            duration: 198000,
            id: '44oCg-G7bQ4',
            image: 'https://i.ytimg.com/vi/PAK5blgfKWM/default.jpg',
            publishTime: '2009-06-16T22:14:25Z',
            title: 'The Doors - Alabama Song'

        }
        const song = (Math.random() > 0.5) ? song1 : song2
        dispatch(setSong(song as Song))

    }

    return (
        <>
            <footer className="music-player">
                {currSong && <><YouTube className="iframe-container" videoId={currSong.id} opts={opts} onReady={onPlayerReady} />
                    <img src={currSong.image} alt="" />
                    <p>{utilService.millisToMinutesAndSeconds(currSong.duration)}</p>
                    |
                    <p>{utilService.millisToMinutesAndSeconds(songTimer)}</p>
                    |
                    <input type="range" min="0" defaultValue="50" max="100" onInput={onVolumeChange} />
                </>}
                <button onClick={changeSong}>Change Song </button>
                <button onClick={onClickPlay}>{isSongPlaying ? 'pause' : 'play'}</button>
            </footer>
        </>
    )
}

