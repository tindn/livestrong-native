import { Provider } from 'react-redux';
import React from 'react';
import App from './app';
import store from './store';

export default function init() {
	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
}
