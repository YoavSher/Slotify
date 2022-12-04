import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from '../../interfaces/song'
import { LikedSongs } from '../../pages/liked-songs'
import { User, userService } from '../../services/user.service'

interface UserState {
    loggedInUser: User | null,
    likedSongs: Song[] | null
}

const initialState: UserState = {
    loggedInUser: userService.getLoggedInUser(), // if we decide to keep the user loggedin it should be via the backend,sending a request and getting a response if the cookie persist,then login and allso make it a function so it loads the songs and all the important things onInit
    likedSongs: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        setUser: (state, action: PayloadAction<User | null>) => {
            if (!action.payload) {
                state.likedSongs = null
            }
            state.loggedInUser = action.payload
        },
        onSongLike: (state, action: PayloadAction<Song>) => {
            if (state.likedSongs) {
                state.likedSongs.unshift(action.payload)
            }
        },
        onSongDislike: (state, action: PayloadAction<string>) => {
            if (state.likedSongs) {
                state.likedSongs = state.likedSongs.filter(song => song.videoId !== action.payload)
            }
        },
        setLikedSongs: (state, action: PayloadAction<Song[] | []>) => {
            state.likedSongs = action.payload

        }
    }
})
export const { setUser, onSongLike, onSongDislike, setLikedSongs } = userSlice.actions


export default userSlice.reducer