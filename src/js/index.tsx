import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/config/store';

import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import { docReady } from './utils/docReady';
import { BASE_PATH } from './Constants';

docReady.then(() => {
	const root = ReactDOM.createRoot(
		document.getElementById('root') as HTMLElement,
	);
	
	root.render(
		<Provider store={store}>
			<Router basename={BASE_PATH}>
				<App />
			</Router>
		</Provider>,
	);
});
