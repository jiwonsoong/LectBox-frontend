import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './_helpers';
import { App } from './App';

// setup fake backend
//import { configureFakeBackend } from './_helpers';
//configureFakeBackend();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);