import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from '../../interfaces/song'
import { LikedSongs } from '../../pages/liked-songs'
import { User, userService } from '../../services/user.service'

interface UserState {
    loggedInUser: User | null,
    likedSongs: Song[] | null
}

const initialState: UserState = {
    loggedInUser: userService.getLoggedInUser(),
    likedSongs: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        setUser: (state, action: PayloadAction<User | null>) => {
            state.loggedInUser = action.payload
            if (!action.payload) state.likedSongs = null
        },
        onSongLike: (state, action: PayloadAction<Song>) => {
            if (state.loggedInUser) {
                // state.likedSongs.push(action.payload)
                // sending to the backend the userId and songId to insert to usersLikedSongs
            }
        },
        onSongDislike: (state, action: PayloadAction<string>) => {
            if (state.loggedInUser) {
                // state.likedSongs = state.loggedInUser.likedSongs.filter(song => song.videoId !== action.payload)
                //sending to the backend the userId and songId to delete the song
            }
        },
        setLikedSongs: (state, action: PayloadAction<Song[] | []>) => {
            state.likedSongs = action.payload

        }
    }
})
export const { setUser, onSongLike, onSongDislike, setLikedSongs } = userSlice.actions


export default userSlice.reducer