import { Slider } from '@mui/material';
import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
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

    // useEffect(() => {
    //     // need to adress what happens when a song ends or switched in the middle of playing
    //     // setSongTimer(0)
    //     // playerRef.current.clearVideo()
    //     // setIsSongPlaying(false)
    // }, [currSong])

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // here i should reset pretty much everything before setting them
        playerRef.current = event.target
        console.log(event.target.getDuration()) // we can get duration from here is in seconds needs to mulyiply it
        console.log(event.target) //   // or do a 2 way data binding that is a bit ugly just to keep it connected
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
    const onVolumeChange = (ev: ChangeEvent<HTMLInputElement>) => {
        playerRef.current.setVolume(+ev.target.value)

    }
    const seekTo = (timeInSeconds: number) => {
        playerRef.current.seekTo(timeInSeconds)
    }

    const timeBarDebounceId = useRef<number>()
    const onChangeTime = (time: number) => {
        // i am replicating the returned function
        //each time i am being called in this function i want to reset the timeout and start a newone
        //the function that will happen the later will just put it on the video,but i allso need to stop the video for the while that 
        //i am debounced

        const later = () => {
            console.log('returning to play')
            window.clearTimeout(timeBarDebounceId.current)
            seekTo(time)
            startVideo()
            //update the video and start it 
        }
        console.log('im paused!')
        setSongTimer(time * 1000)
        pauseVideo()
        window.clearTimeout(timeBarDebounceId.current)
        timeBarDebounceId.current = window.setTimeout(later, 1000)





        // ev: ChangeEvent<HTMLInputElement>
        console.log(time)
        // const time = +ev.target.value
        // i need to debounce it but only for the playerRef.current
        window.setTimeout(() => {

            playerRef.current.seekTo(time)
        }, 0)
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
                    <Slider
                        min={0} defaultValue={87} max={100} onInput={onVolumeChange}
                        sx={{
                            color: '#fff',
                            height: 4,
                            width: 92,
                            '& .MuiSlider-thumb': {
                                width: 8,
                                height: 8,
                                transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                '&:before': {
                                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                                },
                                '&:hover, &.Mui-focusVisible': {
                                    boxShadow: `0px 0px 0px 8px rgb(255 255 255 / 16%)`
                                },
                                '&.Mui-active': {
                                    width: 20,
                                    height: 20,
                                },
                            },
                            '& .MuiSlider-rail': {
                                opacity: 0.28,
                            },
                        }}
                    />
                    <Slider
                        aria-label="time-indicator"
                        size="small"
                        value={songTimer / 1000}
                        min={0}
                        step={1}
                        max={currSong.duration / 1000}

                        onChange={(_, value) => onChangeTime(value as number)}
                        sx={{
                            color: '#fff',
                            height: 4,
                            '& .MuiSlider-thumb': {
                                width: 8,
                                height: 8,
                                transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                '&:before': {
                                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                                },
                                '&:hover, &.Mui-focusVisible': {
                                    boxShadow: `0px 0px 0px 8px rgb(255 255 255 / 16%)`
                                },
                                '&.Mui-active': {
                                    width: 20,
                                    height: 20,
                                },
                            },
                            '& .MuiSlider-rail': {
                                opacity: 0.28,
                            },
                        }}
                    />

                    {/* <p style={{ color: 'white' }}>timer: {songTimer / 1000}
                        maxduration = {currSong.duration / 1000}</p> */}
                </>}
                <button onClick={() => seekTo(songTimer / 1000 + 15)}>Skip 15</button>
                <button onClick={() => seekTo(songTimer / 1000 - 15)}>Back 15</button>
                <button onClick={changeSong}>Change Song </button>
                <button onClick={onClickPlay}>{isSongPlaying ? 'pause' : 'play'}</button>
            </footer>
        </>
    )
}

