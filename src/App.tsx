import React from 'react';
import routes from './routes';
import { Route, Routes } from 'react-router-dom';
import { MusicPlayer } from './cmps/music-player';
import './assets/main.scss'

function App() {
  return (
    <div className="App">
      <main>
        <Routes>
          {routes.map(route => <Route key={route.path} path={route.path} element={<route.component />} />)}
        </Routes>
      </main>
      <MusicPlayer />
    </div>
  );
}

export default App;
