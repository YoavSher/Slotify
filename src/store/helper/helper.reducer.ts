import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    screenWidth: window.innerWidth
}

const HelperSlice = createSlice({
    name: 'helper',
    initialState,
    reducers: {
        setScreenWidth: (state, action: PayloadAction<number>) => {
            state.screenWidth = action.payload
        }
    },
})

export const { setScreenWidth } = HelperSlice.actions

export default HelperSlice.reducer