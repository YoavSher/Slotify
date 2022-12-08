import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import routes from './routes';
import { Route, Routes } from 'react-router-dom';
import { MusicPlayer } from './cmps/music-player';
import './assets/styles/main.scss'
import { AppNavbar } from './cmps/app-navbar-cmps/app-navbar';
import { AppHeader } from './cmps/app-header';
import { useAppDispatch, useAppSelector } from './store/store.hooks';
import { setPlaylists } from './store/playlist/playlist.reducer';
import { playlistService } from './services/playlist.service';
import { setScreenWidth } from './store/helper/helper.reducer';
import { useCookieToGetUser } from './hooks/useCookieToGetUser';

function App() {
  useLoadPlaylists()
  useScreenWidth()
  useCookieToGetUser()

  return (
    <GoogleOAuthProvider clientId="216579650458-fu09u5p61i2tmdg7deqe3epompbcj7fv.apps.googleusercontent.com">
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
    </GoogleOAuthProvider>
  );
}

export default App;

const useLoadPlaylists = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    loadPlayLists()

  }, [])

  const loadPlayLists = async () => {
    const playlists = await playlistService.query()
    if (playlists) dispatch(setPlaylists(playlists))
  }

}

const useScreenWidth = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    window.addEventListener('resize', setDimensions)
    return () => {
      window.removeEventListener('resize', setDimensions)
    }
  }, [])
  const setDimensions = () => {
    dispatch(setScreenWidth(window.innerWidth))
  }
}
