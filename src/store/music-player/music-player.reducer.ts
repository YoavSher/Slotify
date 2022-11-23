import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Playlist } from '../../interfaces/playlist'
import { Song } from '../../interfaces/song'
import { cachingService } from '../../services/music-player-caching.service'
import { utilService } from '../../services/util.service'
interface MusicPlayerState {
    currPlaylist: PseudoPlaylist | Playlist, //should be of type playlist we need to make that interface and make a dummy playlist the defaultand when putting a song alone allso get the dummy playlist
    currPlayingIdx: number,
    isSongPlaying: boolean
}

export interface PseudoPlaylist {
    songs: Song[]
}


const initialState: MusicPlayerState = {
    currPlaylist: { songs: [] },
    currPlayingIdx: 0,
    isSongPlaying: false
}

const musicPlayerSlice = createSlice({
    name: 'musicPlayer',
    initialState,
    reducers: {
        removeSong: (state, action: PayloadAction<string>) => {
            const idx = state.currPlaylist.songs.findIndex(song => song.id === action.payload)
            state.currPlaylist.songs.splice(idx, 1)
            cachingService.saveCurrentPlaylist(state.currPlaylist)
        },
        reorderSongsList: (state, action: PayloadAction<Song[]>) => {
            state.currPlaylist.songs = action.payload
            cachingService.saveCurrentPlaylist(state.currPlaylist)
        },
        setIsSongPlaying: (state, action: PayloadAction<boolean>) => {
            state.isSongPlaying = action.payload
        },
        addToPlaylist: ((state, action: PayloadAction<Song>) => {
            const song = { ...action.payload, id: utilService.makeId() }
            state.currPlaylist.songs.push(song)
            cachingService.saveCurrentPlaylist(state.currPlaylist)
        }),
        replacePlaylist: ((state, action: PayloadAction<Song>) => {
            state.currPlaylist = { songs: [action.payload] }
            state.currPlayingIdx = 0
            cachingService.saveCurrentPlaylist(state.currPlaylist)
            cachingService.savePlayingIdx(state.currPlayingIdx)
        }),
        setPlayingIdx: (state, action: PayloadAction<number>) => {
            if (action.payload <= 0) {
                return
            } else if (action.payload >= state.currPlaylist.songs.length) {
                state.currPlayingIdx = 0
            } else {
                state.currPlayingIdx = action.payload
            }
            cachingService.savePlayingIdx(state.currPlayingIdx)
        },
        setPlaylist: (state, action: PayloadAction<Playlist | PseudoPlaylist>) => {
            state.currPlayingIdx = 0
            state.currPlaylist = action.payload
            cachingService.saveCurrentPlaylist(state.currPlaylist)
            cachingService.savePlayingIdx(state.currPlayingIdx)
        },
    }
})
export const { setPlaylist, addToPlaylist, replacePlaylist, setIsSongPlaying, setPlayingIdx, reorderSongsList, removeSong } = musicPlayerSlice.actions


export default musicPlayerSlice.reducer

