import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './_helpers';
import { App } from './App';

// setup fake backend
<<<<<<< HEAD
//import { configureFakeBackend } from './_helpers';
//configureFakeBackend();
=======
// import { configureFakeBackend } from './_helpers';
// configureFakeBackend();
>>>>>>> bddcc1ea9f01533e2518ae70d49b968f365405ad

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);