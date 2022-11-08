// import { applyMiddleware, combineReducers, compose, legacy_createStore as createStore } from 'redux'
import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import musicPlayerReducer from './music-player/music-player.reducer';
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any,
        gStore: any
    }
}


// const rootReducer = combineReducers({
//     musicPlayerModule: musicPlayerReducer,
//     // userModule: userReducer

// })
export const store = configureStore({
    reducer: {
        musicPlayer: musicPlayerReducer
    }
})

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
// export type RootStore = ReturnType<typeof rootReducer>
// window.gStore = store

