import React, { useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

export const Example = () => {

    let playerRef = useRef<any>()

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // access to player in all event handlers via event.target
        event.target.playVideo();
        playerRef.current = event.target
    }
    const startVideo = () => {
        playerRef.current.playVideo()
        // console.log('playerRef.current: ',playerRef)
    }
    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    return (
        <>
            <YouTube videoId="2g811Eo7K8U" opts={opts} onReady={onPlayerReady} />
            <button onClick={startVideo}>play</button>
        </>
    )


    // _onReady(event: any) {
    //     // access to player in all event handlers via event.target

    //     event.target.pauseVideo();
    // }
}

