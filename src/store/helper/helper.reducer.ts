import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    screenWidth: window.innerWidth,
    isLoading: false
}

const HelperSlice = createSlice({
    name: 'helper',
    initialState,
    reducers: {
        setScreenWidth: (state, action: PayloadAction<number>) => {
            state.screenWidth = action.payload
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        }
    },
})

export const { setScreenWidth, setIsLoading } = HelperSlice.actions

export default HelperSlice.reducer