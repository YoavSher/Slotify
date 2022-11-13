import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, userService } from '../../services/user.servie'

interface UserState {
    loggedInUser: User | null
}

const initialState: UserState = {
    loggedInUser: userService.getLoggedInUser()
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.loggedInUser = action.payload
        }
    }
})
export const { setUser } = userSlice.actions


export default userSlice.reducer