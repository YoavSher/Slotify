import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import musicPlayerReducer from './music-player/music-player.reducer';
import searchReducer from './search/search.reducer';
import playlistReducer from './playlist/playlist.reducer';
import userReducer from './user/user.reducer';
import helperReducer from './helper/helper.reducer';

export const store = configureStore({
    reducer: {
        musicPlayer: musicPlayerReducer,
        searchSong: searchReducer,
        playlist: playlistReducer,
        user: userReducer,
        helper: helperReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


