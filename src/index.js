/* eslint-disable import/extensions */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';

import store, { history } from './redux/configureStore';
import App from './App';

import * as serviceWorker from './serviceWorker';

import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "./provider.js";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import 'emoji-mart/css/emoji-mart.css';
import 'react-image-lightbox/style.css';


ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
  </Web3ReactProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();