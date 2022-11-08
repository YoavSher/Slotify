import React, { useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Song } from '../interfaces/song';
import { utilService } from '../services/util.service';
import { setSong } from '../store/music-player/music-player.reducer';
import { useAppDispatch, useAppSelector } from '../store/store.hooks';

export const MusicPlayer = () => {
    const currSong = useAppSelector(state => state.musicPlayer.currSong)
    const dispatch = useAppDispatch()
    // const currSong = useSelector((state: RootState) => state.musicPlayerModule) // needs to define a state interface!

    const playerRef = useRef<any>()
    const durationIntervalId = useRef<number>()
    const [isSongPlaying, setIsSongPlaying] = useState(false)
    const [songTimer, setSongTimer] = useState(0)
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target
        startVideo()
        // isSongPlaying.current = true
        // pauseVideo()

    }

    const durationInterval = () => {
        durationIntervalId.current = window.setInterval(() => {
            if (currSong && songTimer >= currSong.duration) {
                window.clearInterval(durationIntervalId.current)
            }
            setSongTimer(prev => prev + 500)
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
    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    }
    const changeSong = () => {
        const song = {
            description: 'Official Music Video for Smells Like Teen Spirit performed by Nirvana. Nevermind (30th Anniversary Edition) is available now: ...',
            duration: 279000,
            id: 'hTWKbfoikeg',
            image: 'https://i.ytimg.com/vi/hTWKbfoikeg/default.jpg',
            publishTime: '2009-06-16T22:14:25Z',
            title: 'Nirvana - Smells Like Teen Spirit'

        }
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
                </>}
                <button onClick={changeSong}>Change Song </button>
                <button onClick={onClickPlay}>{isSongPlaying ? 'pause' : 'play'}</button>
            </footer>
        </>
    )
}

