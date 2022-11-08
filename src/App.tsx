import React from 'react';
import logo from './logo.svg';
import routes from './routes';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Example } from './cmps/stam';

function App() {
  return (
    <div className="App">
      {/* <Example/> */}
      <main>
        <Routes>
          {routes.map(route => <Route key={route.path} path={route.path} element={<route.component />} />)}
        </Routes>
      </main>
    </div>
  );
}

export default App;
