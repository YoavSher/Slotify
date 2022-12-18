import { useRef, useState, useEffect } from 'react';
import { Song } from '../interfaces/song';
import { utilService } from '../services/util.service';
import { reorderSongsList } from '../store/music-player/music-player.reducer';
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
        if (isShuffled && playlistId) {
            shuffleSongs()
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