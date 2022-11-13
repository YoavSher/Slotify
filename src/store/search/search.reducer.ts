import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from '../../interfaces/song'


interface searchState {
    searchTerm: string | null, 
    searchResults: Song[] | null | undefined
}

const initialState: searchState = {
    searchTerm: null,
    searchResults: null
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload
        },
        setSearchResults: (state, action: PayloadAction<Song[]>) => {
            state.searchResults = action.payload
        }
    }
})
export const { setSearchResults } = searchSlice.actions

export default searchSlice.reducer