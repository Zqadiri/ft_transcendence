import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PingPong from './components/PingPong';

const root: ReactDOM.Root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <PingPong />
  </React.StrictMode>
);