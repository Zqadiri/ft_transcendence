import ReactDOM from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { cookies } from './components/util';
import { io } from 'socket.io-client';

export const statusSocket = io('/status', {
	forceNew: true,
	auth: { 
		token: cookies.get("_token")
	}
});

statusSocket.on("connect", () => {
	statusSocket.emit("updateStatus", "online");
});

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
