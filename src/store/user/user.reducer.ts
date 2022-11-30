import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from '../../interfaces/song'
import { User, userService } from '../../services/user.service'

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
        },
        onSongLike: (state, action: PayloadAction<Song>) => {
            // state.loggedInUser?.likedSongs.push(action.payload)
            // sending to the backend the userId and songId to insert to usersLikedSongs
        },
        onSongDislike: (state, action: PayloadAction<string>) => {
            if (state.loggedInUser) {
                // state.loggedInUser.likedSongs = state.loggedInUser.likedSongs.filter(song => song.videoId !== action.payload)
                //sending to the backend the userId and songId to delete the song
            }
        }
    }
})
export const { setUser, onSongLike, onSongDislike } = userSlice.actions


export default userSlice.reducer