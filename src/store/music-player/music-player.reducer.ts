import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from '../../interfaces/song'
import { RootState } from '../store'
// import rootstate
interface MusicPlayerState {
    currSong: Song | null
}



const initialState: MusicPlayerState = {
    currSong: null // should be a full object with an interface page,then export it to here
    //they allways have a song on maybe we should too
}
// const initialState = {
//     currSong: 'pkcJEvMcnEg' // should be a full object with an interface page,then export it to here
// } as MusicPlayerState
const musicPlayerSlice = createSlice({
    name: 'musicPlayer',
    initialState,
    reducers: {
        setSong: (state, action: PayloadAction<Song>) => {
            state.currSong = action.payload
        }
    }
})
export const { setSong } = musicPlayerSlice.actions


export default musicPlayerSlice.reducer

