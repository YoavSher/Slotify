import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
// import rootstate
interface MusicPlayerState {
    currSong: string
}



const initialState: MusicPlayerState = {
    currSong: 'pkcJEvMcnEg' // should be a full object with an interface page,then export it to here
}
// const initialState = {
//     currSong: 'pkcJEvMcnEg' // should be a full object with an interface page,then export it to here
// } as MusicPlayerState
const musicPlayerSlice = createSlice({
    name: 'musicPlayer',
    initialState,
    reducers: {
        setSong: (state, action: PayloadAction<string>) => {
            state.currSong = action.payload
        }
    }
})
export const { setSong } = musicPlayerSlice.actions

// export const currSong = (state: RootState) => state.currSong

export default musicPlayerSlice.reducer

