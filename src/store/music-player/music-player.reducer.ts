import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Playlist } from '../../interfaces/playlist'
import { Song } from '../../interfaces/song'
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
        removeSong: (state, action: PayloadAction<number>) => {
            state.currPlaylist.songs = state.currPlaylist.songs.filter((song, index) => index !== action.payload)
        },
        reorderSongsList: (state, action: PayloadAction<Song[]>) => {
            state.currPlaylist.songs = action.payload
        },
        setIsSongPlaying: (state, action: PayloadAction<boolean>) => {
            state.isSongPlaying = action.payload
        },
        addToPlaylist: ((state, action: PayloadAction<Song>) => {
            state.currPlaylist.songs.push(action.payload)
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
export const { setPlaylist, incrementPlayingIdx, decrementPlayingIdx, addToPlaylist, setIsSongPlaying, setPlayingIdx, reorderSongsList, removeSong } = musicPlayerSlice.actions


export default musicPlayerSlice.reducer

