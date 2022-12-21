import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Playlist } from '../../interfaces/playlist'
import { Song } from '../../interfaces/song'
import { cachingService } from '../../services/music-player-caching.service'
import { utilService } from '../../services/util.service'
interface MusicPlayerState {
    currPlayingIdx: number,
    isSongPlaying: boolean,
    songs: Song[],
    playlistId: number | null
}

export interface PseudoPlaylist {
    songs: Song[],
    _id?: string
}


const initialState: MusicPlayerState = {
    currPlayingIdx: 0,
    isSongPlaying: false,
    songs: [],
    playlistId: null
}

const musicPlayerSlice = createSlice({
    name: 'musicPlayer',
    initialState,
    reducers: {
        addSongsToQueue: (state, action: PayloadAction<Song[]>) => {
            state.songs.splice(state.currPlayingIdx + 1, 0, ...action.payload)
            state.playlistId = null
            cachingService.saveCurrentPlaylist({ songs: state.songs, playlistId: state.playlistId })
        },
        removeFromQueue: (state, action: PayloadAction<number>) => {
            state.songs.splice(action.payload, 1)

            cachingService.saveCurrentPlaylist({ songs: state.songs, playlistId: state.playlistId })
        },
        reorderSongsList: (state, action: PayloadAction<Song[]>) => {
            state.songs = action.payload
            cachingService.saveCurrentPlaylist({ songs: state.songs, playlistId: state.playlistId })
        },
        setIsSongPlaying: (state, action: PayloadAction<boolean>) => {
            state.isSongPlaying = action.payload
        },
        addToQueue: ((state, action: PayloadAction<Song>) => {
            const index = state.songs.findIndex((song) => song.videoId === action.payload.videoId)
            state.playlistId = null
            if (index === -1) {
                state.songs.push(action.payload)
            } else if (index < state.currPlayingIdx) {
                state.songs = state.songs.filter((song) => song.videoId !== action.payload.videoId)
                state.currPlayingIdx--
                state.songs.push(action.payload)
            }
            cachingService.saveCurrentPlaylist({ songs: state.songs, playlistId: state.playlistId })
        }),
        replacePlaylist: ((state, action: PayloadAction<Song>) => {
            state.songs = [action.payload]
            state.playlistId = null
            state.currPlayingIdx = 0
            cachingService.saveCurrentPlaylist({ songs: state.songs, playlistId: state.playlistId })
            cachingService.savePlayingIdx(state.currPlayingIdx)
        }),
        setPlayingIdx: (state, action: PayloadAction<number>) => {
            if (action.payload < 0) {
                return
            } else if (action.payload >= state.songs.length) {
                state.currPlayingIdx = 0
            } else {
                state.currPlayingIdx = action.payload
            }
            cachingService.savePlayingIdx(state.currPlayingIdx)
        },
        setPlaylist: (state, action: PayloadAction<{ songs: Song[], playlistId: number | null }>) => {
            state.currPlayingIdx = 0
            state.playlistId = action.payload.playlistId
            state.songs = action.payload.songs
            cachingService.saveCurrentPlaylist({ songs: state.songs, playlistId: state.playlistId })
            cachingService.savePlayingIdx(state.currPlayingIdx)
        },
    }
})
export const { setPlaylist, addToQueue, replacePlaylist, setIsSongPlaying, setPlayingIdx, reorderSongsList, removeFromQueue, addSongsToQueue } = musicPlayerSlice.actions


export default musicPlayerSlice.reducer

