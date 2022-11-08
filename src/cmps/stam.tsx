import React, { useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { setSong } from '../store/music-player/music-player.reducer';
import { useAppDispatch, useAppSelector } from '../store/store.hooks';

export const Example = () => {
    const currSong = useAppSelector(state => state.musicPlayer.currSong)
    const dispatch = useAppDispatch()
    // const currSong = useSelector((state: RootState) => state.musicPlayerModule) // needs to define a state interface!
    const videoIds = ['hTWKbfoikeg', 'fregObNcHC8', 'vabnZ9-ex7o']

    let playerRef = useRef<any>()

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target
    }
    const startVideo = () => {
        playerRef.current.playVideo()
    }
    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    }
    const changeSong = () => {
        dispatch(setSong('fregObNcHC8'))

    }
    console.log(currSong)
    return (
        <>
            <YouTube videoId={currSong} opts={opts} onReady={onPlayerReady} />
            <button onClick={startVideo}>play</button>
            <button onClick={changeSong}>Change Song </button>
        </>
    )
}

