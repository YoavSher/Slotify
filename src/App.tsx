import React from 'react';
import routes from './routes';
import { Route, Routes } from 'react-router-dom';
import { MusicPlayer } from './cmps/music-player';
import './assets/styles/main.scss'
import { AppNavbar } from './cmps/app-navbar';
import { AppHeader } from './cmps/app-header';

function App() {
  return (
    <div className='root-app' >
      <div className="main-app">
        <AppHeader/>
        <AppNavbar />
        <main className='content'>
          <Routes>
            {routes.map(route => <Route key={route.path} path={route.path} element={<route.component />} />)}
          </Routes>
        </main>
        <MusicPlayer />
      </div>
    </div>
  );
}

export default App;
