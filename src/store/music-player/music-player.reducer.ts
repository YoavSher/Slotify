import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Playlist } from '../../interfaces/playlist'
import { Song } from '../../interfaces/song'
import { cachingService } from '../../services/music-player-caching.service'
import { utilService } from '../../services/util.service'
interface MusicPlayerState {
    // currPlaylist: PseudoPlaylist | Playlist, //should be of type playlist we need to make that interface and make a dummy playlist the defaultand when putting a song alone allso get the dummy playlist
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
        removeFromQueue: (state, action: PayloadAction<number>) => {
            state.songs.splice(action.payload, 1)
            // state.playlistId = null

            cachingService.saveCurrentPlaylist({ songs: state.songs, playlistId: state.playlistId })
        },
        reorderSongsList: (state, action: PayloadAction<Song[]>) => {
            state.songs = action.payload
            state.playlistId = null
            cachingService.saveCurrentPlaylist({ songs: state.songs, playlistId: state.playlistId })
        },
        setIsSongPlaying: (state, action: PayloadAction<boolean>) => {
            state.isSongPlaying = action.payload
            // state.playlistId = null
        },
        addToQueue: ((state, action: PayloadAction<Song>) => {
            state.songs.push(action.payload)
            // state.playlistId = null
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
            if (action.payload <= 0) {
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
export const { setPlaylist, addToQueue, replacePlaylist, setIsSongPlaying, setPlayingIdx, reorderSongsList, removeFromQueue } = musicPlayerSlice.actions


export default musicPlayerSlice.reducer

