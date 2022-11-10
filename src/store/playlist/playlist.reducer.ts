import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Playlist } from '../../interfaces/playlist'

interface playlistState {
    playlists: Playlist[]|null
}




const initialState: playlistState = {
    playlists:null
}

const playlistSlice = createSlice({
    name: 'playlist',
    initialState,
    reducers: {
                setPlaylists: (state, action: PayloadAction<Playlist[]>) => {
            state.playlists = action.payload
        }
    },
})

export const { setPlaylists } = playlistSlice.actions

export default playlistSlice.reducer