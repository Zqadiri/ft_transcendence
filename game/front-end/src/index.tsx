import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Game from './components/game/Game';

const root: ReactDOM.Root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
//   <React.StrictMode>
    <Game />
//   </React.StrictMode>
);