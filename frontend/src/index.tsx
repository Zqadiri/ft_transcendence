import ReactDOM from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { cookies } from './components/util';
import { io } from 'socket.io-client';

export const statusSocket = io('/status', {
	forceNew: true,
});

statusSocket.emit('userId', cookies.get('id'));

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	// <React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	// </React.StrictMode>
);
