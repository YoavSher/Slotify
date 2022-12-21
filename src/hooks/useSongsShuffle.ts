import { useRef, useState, useEffect } from 'react';
import { Song } from '../interfaces/song';
import { utilService } from '../services/util.service';
import { reorderSongsList, setPlayingIdx } from '../store/music-player/music-player.reducer';
import { useAppDispatch, useAppSelector } from '../store/store.hooks';

export const useSongsShuffle = (songs: Song[], currPlayingIdx: number, shuffled = false) => {
    const [isShuffled, setIsShuffled] = useState(shuffled)
    const unShuffledSongs = useRef<Song[] | null>(null)
    const dispatch = useAppDispatch()
    const playlistId = useAppSelector(state => state.musicPlayer.playlistId)

    const toggleSongsShuffle = () => {
        if (isShuffled) unShuffleSongs()
        else shuffleSongs()
    }
    useEffect(() => {
        if (isShuffled && playlistId || playlistId === 0) {
            setIsShuffled(true)
            unShuffledSongs.current = songs
            const playingSongs = [...songs]
            const randomIdx = utilService.getRandomNumber(songs.length)
            const [currSong] = playingSongs.splice(randomIdx, 1)
            const newSongs = [currSong, ...utilService.shuffle(playingSongs)]

            dispatch(reorderSongsList(newSongs))
            dispatch(setPlayingIdx(0))

        } else {
            setIsShuffled(false)
            unShuffledSongs.current = null
        }
    }, [playlistId])

    const shuffleSongs = () => {
        setIsShuffled(true)
        unShuffledSongs.current = songs
        // i need the song and the array without the song,shuffle the array without the song and put it in the song

        if (playlistId || playlistId === 0) {
            // it's a real playlist.
            const playingSongs = [...songs]
            const [currSong] = playingSongs.splice(currPlayingIdx, 1)
            const newSongs = [currSong, ...utilService.shuffle(playingSongs)]
            dispatch(reorderSongsList(newSongs))
            dispatch(setPlayingIdx(0))
        } else {
            const afterPlayingIdx = utilService.shuffle(songs.slice(currPlayingIdx + 1))
            const beforePlayingIdx = songs.slice(0, currPlayingIdx + 1)
            // it's just random queue,
            dispatch(reorderSongsList(beforePlayingIdx.concat(afterPlayingIdx)))
        }
    }

    const unShuffleSongs = () => {
        setIsShuffled(false)
        const currSong = songs[currPlayingIdx]
        if (unShuffledSongs.current) {
            //if the reorder playlist and change the index would be on the same function i think that it wont trigger a change on the component
            if (playlistId || playlistId === 0) {
                dispatch(reorderSongsList(unShuffledSongs.current))
                const idx = unShuffledSongs.current.findIndex((song) => song.videoId === currSong.videoId)
                dispatch(setPlayingIdx(idx))
            } else {
                for (let i = currPlayingIdx; i < songs.length; i++) {
                    if (unShuffledSongs.current[i].videoId === currSong.videoId) {
                        dispatch(setPlayingIdx(i)) // change the index so the song doesnt change
                        break
                    }
                }
                dispatch(reorderSongsList(unShuffledSongs.current)) //change the songs
            }
        }
        unShuffledSongs.current = null

    }

    return { isShuffled, toggleSongsShuffle }
}