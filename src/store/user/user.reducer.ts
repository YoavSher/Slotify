import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Playlist } from '../../interfaces/playlist'
import { Song } from '../../interfaces/song'
import { LikedSongs } from '../../pages/liked-songs'
import { User, userService } from '../../services/user.service'

interface UserState {
    loggedInUser: User | null,
    likedSongs: Song[] | null,
    playlists: Playlist[] | null,
}

const initialState: UserState = {
    loggedInUser: null,
    likedSongs: null,
    playlists: null
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
            state.likedSongs = []
            state.playlists = []
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