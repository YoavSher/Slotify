// import { applyMiddleware, combineReducers, compose, legacy_createStore as createStore } from 'redux'
import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import musicPlayerReducer from './music-player/music-player.reducer';

export const store = configureStore({
    reducer: {
        musicPlayer: musicPlayerReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
// export type RootStore = ReturnType<typeof rootReducer>
// window.gStore = store

