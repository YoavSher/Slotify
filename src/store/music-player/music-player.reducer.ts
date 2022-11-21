import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Playlist } from '../../interfaces/playlist'
import { Song } from '../../interfaces/song'
import { utilService } from '../../services/util.service'
interface MusicPlayerState {
    currPlaylist: PseudoPlaylist | Playlist, //should be of type playlist we need to make that interface and make a dummy playlist the defaultand when putting a song alone allso get the dummy playlist
    currPlayingIdx: number,
    isSongPlaying: boolean
}

interface PseudoPlaylist {
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
        },
        reorderSongsList: (state, action: PayloadAction<Song[]>) => {
            state.currPlaylist.songs = action.payload
        },
        setIsSongPlaying: (state, action: PayloadAction<boolean>) => {
            state.isSongPlaying = action.payload
        },
        addToPlaylist: ((state, action: PayloadAction<Song>) => {
            const song = { ...action.payload, id: utilService.makeId() }
            state.currPlaylist.songs.push(song)
        }),
        replacePlaylist: ((state, action: PayloadAction<Song>) => {
            state.currPlaylist = { songs: [action.payload] }
            state.currPlayingIdx = 0
        }),
        setPlayingIdx: (state, action: PayloadAction<number>) => {
            state.currPlayingIdx = action.payload
        },
        incrementPlayingIdx: (state) => {
            state.currPlayingIdx++
            if (state.currPlayingIdx >= state.currPlaylist.songs.length) {
                state.currPlayingIdx = 0
            }
        },
        decrementPlayingIdx: (state) => {
            if (state.currPlayingIdx > 0) state.currPlayingIdx--
        },
        setPlaylist: (state, action: PayloadAction<Playlist>) => { // should turn to a playlist
            state.currPlayingIdx = 0
            state.currPlaylist = action.payload
        },
    }
})
export const { setPlaylist, incrementPlayingIdx, decrementPlayingIdx, addToPlaylist, replacePlaylist, setIsSongPlaying, setPlayingIdx, reorderSongsList, removeSong } = musicPlayerSlice.actions


export default musicPlayerSlice.reducer

