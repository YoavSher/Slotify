import React, { useEffect, useState } from 'react';
import routes from './routes';
import { Route, Routes } from 'react-router-dom';
import { MusicPlayer } from './cmps/music-player';
import './assets/styles/main.scss'
import { AppNavbar } from './cmps/app-navbar';
import { AppHeader } from './cmps/app-header';
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';
import { useAppDispatch, useAppSelector } from './store/store.hooks';
import { setPlaylists } from './store/playlist/playlist.reducer';
import { playlistService } from './services/playlist.service';
import { setScreenWidth } from './store/helper/helper.reducer';

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    loadPlayLists()
    window.addEventListener('resize', setDimensions)
    return () => {
      window.removeEventListener('resize', setDimensions)
    }
  }, [])

  const setDimensions = () => {
    dispatch(setScreenWidth(window.innerWidth))
  }
  const loadPlayLists = async () => {
    const playlists = await playlistService.query()
    if (playlists) dispatch(setPlaylists(playlists))
  }


  return (
    <div className='root-app' >
      <div className="main-app">
        <AppHeader />
        <AppNavbar />
        <main className='content-container'>
          <div className='main-content'>
            <Routes>
              {routes.map(route => {
                if (route?.children?.length) {
                  return (
                    <Route key={route.path} path={route.path} element={<route.component />}>
                      {route.children.map(childRoute => <Route key={childRoute.path} path={childRoute.path} element={<childRoute.component />} />)}
                    </Route>)
                }
                else return <Route key={route.path} path={route.path} element={<route.component />} />
              })}
            </Routes>
          </div>
        </main>
        <MusicPlayer />
      </div>
    </div>
  );
}

export default App;
