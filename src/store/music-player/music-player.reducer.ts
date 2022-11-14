import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from '../../interfaces/song'
interface MusicPlayerState {
    currPlaylist: PseudoPlaylist | Playlist, //should be of type playlist we need to make that interface and make a dummy playlist the defaultand when putting a song alone allso get the dummy playlist
    currPlayingIdx: number
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
    currPlayingIdx: 0
}

const musicPlayerSlice = createSlice({
    name: 'musicPlayer',
    initialState,
    reducers: {
        addToPlaylist: ((state, action: PayloadAction<Song>) => {
            state.currPlaylist.songs.push(action.payload)
        }),
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
            console.log(action.payload)
            state.currPlaylist = action.payload
        },
    }
})
export const { setPlaylist, incrementPlayingIdx, decrementPlayingIdx, addToPlaylist } = musicPlayerSlice.actions


export default musicPlayerSlice.reducer

