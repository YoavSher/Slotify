import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Playlist } from '../../interfaces/playlist'
import { Song } from '../../interfaces/song'


interface searchState {
    searchTerm: string | null,
    searchResults: Song[] | null | undefined,
    searchedPlaylists: Playlist[] | null
}

const initialState: searchState = {
    searchTerm: '',
    searchResults: null,
    searchedPlaylists: null
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload
        },
        setSearchResults: (state, action: PayloadAction<Song[] | null>) => {
            state.searchResults = action.payload
        },
        setSearchedPlaylists: (state, action: PayloadAction<Playlist[] | null>) => {
            state.searchedPlaylists = action.payload
        }
    }
})
export const { setSearchResults, setSearchedPlaylists ,setSearchTerm} = searchSlice.actions

export default searchSlice.reducer