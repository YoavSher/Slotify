import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from '../../interfaces/song'
interface MusicPlayerState {
    currPlaylist: PseudoPlaylist | Playlist, //should be of type playlist we need to make that interface and make a dummy playlist the defaultand when putting a song alone allso get the dummy playlist
    currPlayingIdx: number,
    isSongPlaying: boolean
}

interface PseudoPlaylist {
    songs: Song[]
}
interface Playlist {
    _id: string,
    name: string,
    imgUrl: string,
    tags: string[],
    createdBy: {
        _id: string,
        fullname: string,
        imgUrl: string,
    },
    likedByUsers: [],
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
        setPlaylist: (state, action: PayloadAction<any>) => { // should turn to a playlist
            state.currPlayingIdx = 0
            state.currPlaylist = action.payload
        },
    }
})
export const { setPlaylist, incrementPlayingIdx, decrementPlayingIdx, addToPlaylist, setIsSongPlaying, setPlayingIdx } = musicPlayerSlice.actions


export default musicPlayerSlice.reducer

