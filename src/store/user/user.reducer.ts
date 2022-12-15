import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Playlist } from '../../interfaces/playlist'
import { Song } from '../../interfaces/song'
import { LikedSongs } from '../../pages/liked-songs'
import { User, userService } from '../../services/user.service'

interface UserState {
    loggedInUser: User | null,
    likedSongs: Song[] | null,
    playlists: Playlist[] | null,
    recentPlaylists: Playlist[] | null
}

const initialState: UserState = {
    loggedInUser: null,
    likedSongs: null,
    playlists: null,
    recentPlaylists: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        onPlaylistPlay: (state, action: PayloadAction<Playlist>) => {
            if (state.recentPlaylists) {
                const playlistIdx = state.recentPlaylists.findIndex(playlist => playlist._id === action.payload._id)
                if (playlistIdx !== -1) {
                    state.recentPlaylists = state.recentPlaylists.filter(playlist => playlist._id !== action.payload._id)
                }
                if (state.recentPlaylists.length >= 6) {
                    state.recentPlaylists.pop()
                }
                state.recentPlaylists.unshift(action.payload)

            }
        },
        onPlaylistLike: (state, action: PayloadAction<Playlist>) => {
            if (state.playlists) {
                state.playlists.push(action.payload)
            }
        },
        onPlaylistDislike: (state, action: PayloadAction<number>) => {
            if (state.playlists) {
                state.playlists = state.playlists.filter(playlist => playlist._id !== action.payload)
            }
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            if (!action.payload) {
                state.likedSongs = null
                state.playlists = null
                state.recentPlaylists = null
            }
            state.loggedInUser = action.payload
            state.likedSongs = []
            state.playlists = []
            state.recentPlaylists = []
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

        },
        setLikedPlaylists: (state, action: PayloadAction<Playlist[] | []>) => {
            state.playlists = action.payload

        },
        setRecentPlaylists: (state, action: PayloadAction<Playlist[] | []>) => {
            state.recentPlaylists = action.payload

        },
        updateUserPlaylist: (state, action: PayloadAction<Playlist>) => {
            if (state.playlists) {
                state.playlists = state.playlists.map(p => p._id === action.payload._id ? action.payload : p)
            }
        },
    }
})
export const { updateUserPlaylist, setUser, onSongLike, onSongDislike, setLikedSongs, setLikedPlaylists, onPlaylistDislike, onPlaylistLike, setRecentPlaylists, onPlaylistPlay } = userSlice.actions


export default userSlice.reducer